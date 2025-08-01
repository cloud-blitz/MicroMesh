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

### Auth Service (Port 8081)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Product Service (Port 8082)
- `GET /api/products` - Get all products
- `POST /api/products` - Add new product

### Order Service (Port 8083)
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order

## Testing Workflow

1. **Start Services**: Ensure all microservices are running
2. **Test Connectivity**: Run `npm run test:services` to verify all services
3. **Access Dashboard**: Open http://localhost:3000
4. **Test Auth**: Register a user and then login
5. **Test Products**: Add products to the catalog
6. **Test Orders**: Create orders using product IDs
7. **Monitor**: Watch the activity feed for real-time updates

## Troubleshooting

### Services Not Responding
- Check if Docker containers are running: `docker ps`
- Restart services: `docker-compose restart`
- Check logs: `docker-compose logs [service-name]`

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
- `AUTH_SERVICE_URL` - Auth service URL
- `PRODUCT_SERVICE_URL` - Product service URL
- `ORDER_SERVICE_URL` - Order service URL

## Contributing

1. Test all services before making changes
2. Update the test script for new features
3. Maintain consistent styling and UX
4. Add appropriate error handling
5. Update documentation for new features 