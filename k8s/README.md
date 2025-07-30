# Kubernetes Deployment for MicroMesh

This directory contains Kubernetes manifests for deploying the MicroMesh microservices architecture.

## Prerequisites

- Kubernetes cluster (minikube, kind, or cloud provider)
- kubectl CLI tool
- Docker images built locally or in a registry
- NGINX Ingress Controller installed

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Auth Service  │    │ Product Service │    │  Order Service  │
│   (2 replicas)  │    │   (2 replicas)  │    │   (2 replicas)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │  MongoDB Atlas  │
                    │   (Cloud DB)    │
                    └─────────────────┘

┌─────────────────┐
│   CloudFront    │
│   (Frontend)    │
└─────────────────┘
```

## Files Structure

```
k8s/
├── namespace.yaml                    # Namespace definition
├── configmap.yaml                   # Configuration data (MongoDB Atlas)
├── secrets.yaml                     # Sensitive data
├── cloudfront-config.yaml           # CloudFront configuration
├── auth-service-deployment.yaml     # Auth service deployment & service
├── product-service-deployment.yaml  # Product service deployment & service
├── order-service-deployment.yaml    # Order service deployment & service
├── ingress.yaml                     # Ingress configuration
├── kustomization.yaml              # Kustomize configuration
└── README.md                       # This file
```

## Quick Start

### 1. Build Docker Images

```bash
# Build images locally
docker build -t auth-service:latest ./auth-service
docker build -t product-service:latest ./product-service
docker build -t order-service:latest ./order-service
```

### 2. Load Images to Minikube (if using minikube)

```bash
# Load images to minikube
minikube image load auth-service:latest
minikube image load product-service:latest
minikube image load order-service:latest
```

### 3. Configure MongoDB Atlas

Before deploying, update the MongoDB Atlas connection strings in `configmap.yaml`:

```bash
# Update MongoDB Atlas connection strings
# Replace the placeholder values with your actual Atlas connection strings
```

### 4. Deploy to Kubernetes

```bash
# Apply all resources
kubectl apply -k .

# Or apply individually
kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml
kubectl apply -f secrets.yaml
kubectl apply -f auth-service-deployment.yaml
kubectl apply -f product-service-deployment.yaml
kubectl apply -f order-service-deployment.yaml
kubectl apply -f ingress.yaml
```

### 5. Verify Deployment

```bash
# Check namespace
kubectl get namespace micromesh

# Check all resources
kubectl get all -n micromesh

# Check pods
kubectl get pods -n micromesh

# Check services
kubectl get services -n micromesh

# Check ingress
kubectl get ingress -n micromesh
```

## Service Endpoints

### Internal Service URLs
- **Auth Service**: `http://auth-service:8081`
- **Product Service**: `http://product-service:8082`
- **Order Service**: `http://order-service:8083`
- **MongoDB**: `mongodb://mongodb:27017`

### External Access (via Ingress)

#### Individual Hosts:
- **Auth Service**: `https://auth.micromesh.com`
- **Product Service**: `https://products.micromesh.com`
- **Order Service**: `https://orders.micromesh.com`

#### API Gateway:
- **Auth Service**: `https://api.micromesh.com/auth`
- **Product Service**: `https://api.micromesh.com/products`
- **Order Service**: `https://api.micromesh.com/orders`

### Frontend Access (CloudFront)
- **Frontend**: `https://app.micromesh.com`

## Configuration

### Environment Variables

Services use the following environment variables:

#### Auth Service:
- `SPRING_DATA_MONGODB_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_EXPIRATION`: JWT token expiration time
- `SERVER_PORT`: Service port (8081)

#### Product Service:
- `SPRING_DATA_MONGODB_URI`: MongoDB Atlas connection string
- `SERVER_PORT`: Service port (8082)

#### Order Service:
- `SPRING_DATA_MONGODB_URI`: MongoDB Atlas connection string
- `PRODUCT_SERVICE_URL`: Product service URL
- `SERVER_PORT`: Service port (8083)

### Resource Limits

All services have resource limits:
- **CPU**: 250m request, 500m limit
- **Memory**: 256Mi request, 512Mi limit

## Health Checks

All services include:
- **Liveness Probe**: `/actuator/health` endpoint
- **Readiness Probe**: `/actuator/health` endpoint
- **Initial Delay**: 30-60 seconds
- **Period**: 10-30 seconds

## Scaling

### Scale Services

```bash
# Scale auth service
kubectl scale deployment auth-service --replicas=3 -n micromesh

# Scale product service
kubectl scale deployment product-service --replicas=3 -n micromesh

# Scale order service
kubectl scale deployment order-service --replicas=3 -n micromesh
```

### Auto Scaling (HPA)

To enable Horizontal Pod Autoscaler:

```bash
# Create HPA for auth service
kubectl autoscale deployment auth-service --cpu-percent=70 --min=2 --max=10 -n micromesh

# Create HPA for product service
kubectl autoscale deployment product-service --cpu-percent=70 --min=2 --max=10 -n micromesh

# Create HPA for order service
kubectl autoscale deployment order-service --cpu-percent=70 --min=2 --max=10 -n micromesh
```

## Monitoring

### View Logs

```bash
# View logs for all pods
kubectl logs -f deployment/auth-service -n micromesh
kubectl logs -f deployment/product-service -n micromesh
kubectl logs -f deployment/order-service -n micromesh
```

### Check Health

```bash
# Check pod status
kubectl get pods -n micromesh

# Describe pod for details
kubectl describe pod <pod-name> -n micromesh

# Check service endpoints
kubectl get endpoints -n micromesh
```

## Troubleshooting

### Common Issues

1. **Pods not starting**:
   ```bash
   kubectl describe pod <pod-name> -n micromesh
   kubectl logs <pod-name> -n micromesh
   ```

2. **Services not accessible**:
   ```bash
   kubectl get services -n micromesh
   kubectl describe service <service-name> -n micromesh
   ```

3. **Ingress not working**:
   ```bash
   kubectl get ingress -n micromesh
   kubectl describe ingress micromesh-ingress -n micromesh
   ```

4. **MongoDB Atlas connection issues**:
   ```bash
   kubectl logs -f deployment/auth-service -n micromesh
   kubectl logs -f deployment/product-service -n micromesh
   kubectl logs -f deployment/order-service -n micromesh
   ```

### Debug Commands

```bash
# Port forward to access services directly
kubectl port-forward service/auth-service 8081:8081 -n micromesh
kubectl port-forward service/product-service 8082:8082 -n micromesh
kubectl port-forward service/order-service 8083:8083 -n micromesh
```

## Cleanup

```bash
# Delete all resources
kubectl delete -k .

# Or delete individually
kubectl delete -f ingress.yaml
kubectl delete -f order-service-deployment.yaml
kubectl delete -f product-service-deployment.yaml
kubectl delete -f auth-service-deployment.yaml
kubectl delete -f secrets.yaml
kubectl delete -f configmap.yaml
kubectl delete -f namespace.yaml
```

## MongoDB Atlas Setup

### 1. Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a new cluster
3. Configure network access (allow all IPs or specific IPs)
4. Create database user with read/write permissions

### 2. Get Connection Strings

1. In Atlas, go to your cluster
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password

### 3. Update Configuration

Update `configmap.yaml` with your Atlas connection strings:

```yaml
data:
  mongodb-auth-uri: "mongodb+srv://your-username:your-password@cluster.mongodb.net/auth_service_db?retryWrites=true&w=majority"
  mongodb-product-uri: "mongodb+srv://your-username:your-password@cluster.mongodb.net/product_service_db?retryWrites=true&w=majority"
  mongodb-order-uri: "mongodb+srv://your-username:your-password@cluster.mongodb.net/order_service_db?retryWrites=true&w=majority"
```

## CloudFront Setup

### 1. Create S3 Bucket

```bash
# Create S3 bucket for frontend
aws s3 mb s3://micromesh-frontend

# Upload frontend files
aws s3 sync ./frontend/build s3://micromesh-frontend
```

### 2. Create CloudFront Distribution

```bash
# Create CloudFront distribution
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-distribution.json
```

### 3. Configure DNS

Point your domain to CloudFront:
- `app.micromesh.com` → CloudFront distribution
- `api.micromesh.com` → Kubernetes ingress
- `auth.micromesh.com` → Kubernetes ingress
- `products.micromesh.com` → Kubernetes ingress
- `orders.micromesh.com` → Kubernetes ingress

## Production Considerations

1. **Security**:
   - Use proper secrets management
   - Enable RBAC
   - Use network policies
   - Enable pod security policies
   - Configure MongoDB Atlas IP whitelist

2. **Monitoring**:
   - Deploy Prometheus and Grafana
   - Set up alerting
   - Use distributed tracing
   - Monitor CloudFront metrics

3. **Storage**:
   - Use appropriate storage classes
   - Configure backup strategies
   - Monitor storage usage
   - Set up MongoDB Atlas backups

4. **Networking**:
   - Configure proper ingress TLS
   - Set up service mesh if needed
   - Configure network policies
   - Set up CloudFront SSL certificates

5. **Scaling**:
   - Configure HPA with proper metrics
   - Use cluster autoscaler
   - Monitor resource usage
   - Configure CloudFront cache policies 