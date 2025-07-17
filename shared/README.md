# Microservices Web Application

A comprehensive microservice-based web application with real-time service monitoring dashboard.

## 🏗️ Architecture

### Services
- **Frontend**: Node.js + Express + EJS with real-time dashboard
- **Auth Service**: Spring Boot + JWT authentication
- **Product Service**: Spring Boot + MongoDB for product management
- **Order Service**: Spring Boot + MongoDB for order processing

### Technology Stack
- **Frontend**: Node.js, Express, EJS, Tailwind CSS, D3.js
- **Backend**: Java17 Spring Boot, Gradle, MongoDB
- **Visualization**: D3 real-time service connectivity graph
- **Communication**: HTTP REST APIs between services

## 🚀 Quick Start

### Prerequisites
- Java 17e.js 16 MongoDB 5+
- Gradle 7+

### Setup Instructions

1. **Clone and Setup**
   ```bash
   git clone <repository>
   cd microservices
   ```2ment Configuration**
   ```bash
   cp shared/env.example shared/.env
   # Edit shared/.env with your configuration
   ```

3**Start MongoDB**
   ```bash
   mongod --dbpath /path/to/data/db
   ```

4. **Start Services**
   ```bash
   # Terminal 1Auth Service
   cd auth-service && ./gradlew bootRun
   
   # Terminal 2: Product Service
   cd product-service && ./gradlew bootRun
   
   # Terminal3: Order Service
   cd order-service && ./gradlew bootRun
   
   # Terminal4ontend
   cd frontend && npm start
   ```

5. **Access Dashboard**
   - Frontend: http://localhost:3000
   - Auth Service: http://localhost:8081
   - Product Service: http://localhost:8082
   - Order Service: http://localhost:8083Dashboard Features

- Real-time service status monitoring
- Animated service connectivity graph
- Health check indicators
- Service communication flow visualization
- Auto-refresh every 5 seconds

## 🔧 API Endpoints

### Auth Service (Port 8081
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /health` - Health check

### Product Service (Port8082`GET /api/products` - List all products
- `POST /api/products` - Create product
- `GET /api/products/{id}` - Get product by ID
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product
- `GET /health` - Health check

### Order Service (Port 8083- `GET /api/orders` - List all orders
- `POST /api/orders` - Create order
- `GET /api/orders/{id}` - Get order by ID
- `PUT /api/orders/{id}` - Update order status
- `GET /health` - Health check

## 🗂️ Project Structure

```
microservices/
├── frontend/                 # Node.js frontend with dashboard
│   ├── server.js
│   ├── views/
│   └── public/
├── auth-service/            # Authentication microservice
│   ├── build.gradle
│   └── src/main/java/
├── product-service/         # Product management microservice
│   ├── build.gradle
│   └── src/main/java/
├── order-service/          # Order processing microservice
│   ├── build.gradle
│   └── src/main/java/
└── shared/                 # Shared configuration
    ├── .env
    └── README.md
```

## 🔒 Security

- JWT-based authentication
- CORS configuration for cross-service communication
- Environment-based configuration
- Secure password hashing

## 📈 Monitoring

- Real-time health checks
- Service status indicators
- Connection flow visualization
- Error tracking and logging

## 🛠️ Development

### Adding New Services
1. Create new service directory
2Boot configuration
3. Update environment variables4rvice to dashboard monitoring

### Customizing Dashboard
- Modify `frontend/public/js/dashboard.js` for visualization logic
- Update `frontend/views/dashboard.ejs` for UI changes
- Configure service endpoints in `frontend/server.js`

## 📝 License

MIT License - see LICENSE file for details 