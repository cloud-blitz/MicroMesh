# Static Dashboard Build

This folder contains the static build of the Microservices Dashboard for CloudFront deployment.

## Files:
- `index.html` - Main dashboard page
- `public/` - Static assets (CSS, JS, images)
- `config.json` - Build configuration
- `public/js/static-api.js` - API simulation for static deployment

## Deployment:
Upload the contents of this folder to your CloudFront distribution's S3 bucket.

## Notes:
- This is a static build that simulates API calls
- For real-time data, you'll need to configure API endpoints
- The dashboard will show mock data in static mode

Build time: 2025-08-01T19:20:05.075Z
