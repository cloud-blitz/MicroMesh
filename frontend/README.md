# Microservices Testing Dashboard

A comprehensive testing interface for all microservices with real-time monitoring and data validation.

## Features

### 🎯 Service Testing Interface
- **Auth Service Testing**: User registration and login forms
- **Product Service Testing**: Add products and fetch product catalog
- **Order Service Testing**: Create orders and view order history
- **Real-time Response Display**: See API responses in formatted JSON
- **Activity Feed**: Track all operations in real-time

### 📊 Service Monitoring
- Real-time service status monitoring
- Health check indicators
- Service architecture visualization
- Response time tracking

### 🎨 Modern UI
- Glass morphism design
- Responsive layout
- Tabbed interface for organized testing
- Beautiful gradients and animations

### 🌐 ALB Path-Based Routing Support
- Automatic routing based on environment
- Development: Direct service URLs
- Production: ALB path-based routing
- Configurable via environment variables

## Getting Started

### Prerequisites
Make sure all microservices are running:
```bash
docker-compose up
```

### Install Dependencies
```bash
cd frontend
npm install
```

### Test Services
Before using the dashboard, test if all services are working:
```bash
npm run test:services
```

### Start Dashboard
```bash
npm start
```

The dashboard will be available at: http://localhost:3000

## Environment Configuration

### Development Environment
The dashboard uses local service URLs by default:
- Auth Service: `http://localhost:8081`
- Product Service: `http://localhost:8082`
- Order Service: `http://localhost:8083`

### Production Environment (ALB Routing)
For production with ALB path-based routing:
- Auth Service: `https://api.micromesh.com/auth`
- Product Service: `https://api.micromesh.com/products`
- Order Service: `https://api.micromesh.com/orders`

### Environment Variables

#### Development (.env)
```bash
ENVIRONMENT=development
USE_ALB_ROUTING=false

# Local service URLs
AUTH_SERVICE_URL=http://localhost:8081
PRODUCT_SERVICE_URL=http://localhost:8082
ORDER_SERVICE_URL=http://localhost:8083
```

#### Production (.env)
```bash
ENVIRONMENT=production
USE_ALB_ROUTING=true

# ALB service URLs
AUTH_SERVICE_ALB_URL=https://api.micromesh.com/auth
PRODUCT_SERVICE_ALB_URL=https://api.micromesh.com/products
ORDER_SERVICE_ALB_URL=https://api.micromesh.com/orders
```

## Usage Guide

### 1. Auth Service Testing
- **Register User**: Create new user accounts with username, email, and password
- **Login**: Test user authentication with username and password
- **Response**: View JWT tokens and user data

### 2. Product Service Testing
- **Add Product**: Create new products with name, description, price, and stock
- **Get Products**: Fetch all products from the catalog
- **Response**: View product data and inventory

### 3. Order Service Testing
- **Create Order**: Place orders with customer details, product ID, quantity, and shipping address
- **Get Orders**: View all orders in the system
- **Response**: See order status and details

### 4. Real-time Monitoring
- **Service Status**: Monitor health of all services
- **Activity Feed**: Track all operations in real-time
- **Architecture Diagram**: Visual representation of service interactions

## API Endpoints

The dashboard proxies requests to the following backend services:

### Auth Service
- **Development**: `http://localhost:8081/auth/register`, `http://localhost:8081/auth/login`
- **Production**: `https://api.micromesh.com/auth/register`, `https://api.micromesh.com/auth/login`

### Product Service
- **Development**: `http://localhost:8082/products`
- **Production**: `https://api.micromesh.com/products`

### Order Service
- **Development**: `http://localhost:8083/orders`
- **Production**: `https://api.micromesh.com/orders`

## ALB Path-Based Routing

The dashboard automatically adapts to your ALB configuration:

### Ingress Configuration (k8s/ingress.yaml)
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: micromesh-ingress
spec:
  rules:
  - host: api.micromesh.com
    http:
      paths:
      - path: /auth
        backend:
          service:
            name: auth-service
            port:
              number: 8081
      - path: /products
        backend:
          service:
            name: product-service
            port:
              number: 8082
      - path: /orders
        backend:
          service:
            name: order-service
            port:
              number: 8083
```

### URL Mapping
- `/auth/*` → Auth Service (Port 8081)
- `/products/*` → Product Service (Port 8082)
- `/orders/*` → Order Service (Port 8083)

## Testing Workflow

1. **Start Services**: Ensure all microservices are running
2. **Test Connectivity**: Run `npm run test:services` to verify all services
3. **Access Dashboard**: Open http://localhost:3000
4. **Test Auth**: Register a user and then login
5. **Test Products**: Add products to the catalog
6. **Test Orders**: Create orders using product IDs
7. **Monitor**: Watch the activity feed for real-time updates

## Deployment

### Development
```bash
# Use local services
ENVIRONMENT=development USE_ALB_ROUTING=false npm start
```

### Production
```bash
# Use ALB routing
ENVIRONMENT=production USE_ALB_ROUTING=true npm start
```

### Docker Deployment
```bash
# Build and run with production config
docker build -t micromesh-frontend .
docker run -p 3000:3000 --env-file shared/.env micromesh-frontend
```

## Troubleshooting

### Services Not Responding
- Check if Docker containers are running: `docker ps`
- Restart services: `docker-compose restart`
- Check logs: `docker-compose logs [service-name]`

### ALB Routing Issues
- Verify ingress configuration in Kubernetes
- Check ALB health status
- Ensure DNS resolution for `api.micromesh.com`
- Verify SSL certificates for HTTPS endpoints

### Dashboard Issues
- Clear browser cache
- Check browser console for errors
- Verify all services are healthy in the status cards

### API Errors
- Check service logs for detailed error messages
- Verify request format matches backend expectations
- Ensure all required fields are provided

## Development

### Adding New Tests
1. Add new API endpoints in `server.js`
2. Create corresponding forms in `dashboard.ejs`
3. Add JavaScript handlers for form submission
4. Update the test script if needed

### Styling
- Uses Tailwind CSS for styling
- Custom CSS classes for glass morphism effects
- Responsive design for mobile and desktop

### Real-time Features
- Activity feed updates automatically
- Service status refreshes every 5 seconds
- Form responses display immediately

## Environment Variables

The dashboard uses environment variables from `../shared/.env`:
- `FRONTEND_PORT` - Dashboard port (default: 3000)
- `ENVIRONMENT` - Environment (development/production)
- `USE_ALB_ROUTING` - Enable ALB routing (true/false)
- `AUTH_SERVICE_URL` / `AUTH_SERVICE_ALB_URL` - Auth service URLs
- `PRODUCT_SERVICE_URL` / `PRODUCT_SERVICE_ALB_URL` - Product service URLs
- `ORDER_SERVICE_URL` / `ORDER_SERVICE_ALB_URL` - Order service URLs

## Contributing

1. Test all services before making changes
2. Update the test script for new features
3. Maintain consistent styling and UX
4. Add appropriate error handling
5. Update documentation for new features 