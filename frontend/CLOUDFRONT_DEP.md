# CloudFront + Route53 Deployment Guide

This guide covers deploying the Microservices Dashboard frontend to AWS CloudFront with a custom domain using Route53.

## 📋 Prerequisites

- AWS Account with appropriate permissions
- Domain name registered in Route53 (or transferred to Route53)
- AWS CLI configured locally
- S3 bucket for hosting static files

## 🚀 Step-by-Step Deployment

### 1. Create S3 Bucket for Static Hosting

```bash
# Create S3 bucket (replace with your domain)
aws s3 mb s3://your-dashboard-domain.com

# Enable static website hosting
aws s3 website s3://your-dashboard-domain.com --index-document index.html --error-document index.html
```

**S3 Bucket Policy** (replace `your-dashboard-domain.com`):
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::your-dashboard-domain.com/*"
        }
    ]
}
```

### 2. Upload Static Files to S3

```bash
# Build the static files
cd frontend
npm run build

# Upload to S3 (replace with your bucket name)
aws s3 sync dist/ s3://your-dashboard-domain.com --delete

# Or upload manually via AWS Console
# Navigate to S3 > your-bucket > Upload > Select all files from dist/
```

### 3. Create CloudFront Distribution

#### Via AWS Console:
1. **Go to CloudFront** → Create Distribution
2. **Origin Settings:**
   - Origin Domain: `your-dashboard-domain.com.s3.amazonaws.com`
   - Origin Path: (leave empty)
   - Origin ID: `S3-your-dashboard-domain.com`

3. **Default Cache Behavior:**
   - Viewer Protocol Policy: `Redirect HTTP to HTTPS`
   - Allowed HTTP Methods: `GET, HEAD, OPTIONS`
   - Cache Policy: `CachingOptimized` (or create custom)
   - Origin Request Policy: `CORS-S3Origin`

4. **Settings:**
   - Price Class: `Use Only North America and Europe`
   - Alternate Domain Names (CNAMEs): `your-dashboard-domain.com`
   - SSL Certificate: `Request certificate for this distribution`

### 4. Request SSL Certificate

#### Via AWS Certificate Manager:
1. **Go to Certificate Manager** → Request Certificate
2. **Domain Names:**
   - `your-dashboard-domain.com`
   - `*.your-dashboard-domain.com` (for subdomains)
3. **Validation Method:** DNS validation (recommended)
4. **Tags:** Add appropriate tags

#### DNS Validation Records:
Add these CNAME records to your Route53 hosted zone:
```
Name: _abc123def456.your-dashboard-domain.com
Value: _abc123def456.abcdefghijk.acm-validations.aws
```

### 5. Configure Route53 DNS

#### Create/Update Hosted Zone:
1. **Go to Route53** → Hosted Zones
2. **Create Hosted Zone** (if domain not in Route53):
   - Domain Name: `your-dashboard-domain.com`

#### Add DNS Records:
```bash
# Create A record for CloudFront
aws route53 change-resource-record-sets \
  --hosted-zone-id YOUR_HOSTED_ZONE_ID \
  --change-batch '{
    "Changes": [
      {
        "Action": "UPSERT",
        "ResourceRecordSet": {
          "Name": "your-dashboard-domain.com",
          "Type": "A",
          "AliasTarget": {
            "HostedZoneId": "Z2FDTNDATAQYW2",
            "DNSName": "YOUR_CLOUDFRONT_DOMAIN.cloudfront.net",
            "EvaluateTargetHealth": false
          }
        }
      }
    ]
  }'
```

**Manual DNS Records:**
```
Type: A
Name: your-dashboard-domain.com
Alias: Yes
Alias Target: YOUR_CLOUDFRONT_DOMAIN.cloudfront.net
```

### 6. Update CloudFront Distribution

After SSL certificate is validated:
1. **Go to CloudFront** → Your Distribution → Edit
2. **Alternate Domain Names (CNAMEs):** Add `your-dashboard-domain.com`
3. **SSL Certificate:** Select your validated certificate
4. **Save Changes**

### 7. Configure CloudFront Behaviors

#### Cache Behavior Settings:
```
Path Pattern: /*
Viewer Protocol Policy: Redirect HTTP to HTTPS
Allowed HTTP Methods: GET, HEAD, OPTIONS
Cache Policy: CachingOptimized
Origin Request Policy: CORS-S3Origin
```

#### Custom Error Pages:
```
Error Code: 403
Response Page Path: /index.html
Response Code: 200
```

```
Error Code: 404
Response Page Path: /index.html
Response Code: 200
```