# 🚀 Microservices Dashboard

A stunning, real-time microservices monitoring dashboard with beautiful animations, database connectivity status, and comprehensive service monitoring.

![Dashboard Preview](https://img.shields.io/badge/Status-Active-brightgreen)
![Java](https://img.shields.io/badge/Java-17+-orange)
![Node.js](https://img.shields.io/badge/Node.js-16+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-5+-blue)

## ✨ Features

### 🎨 **Beautiful Modern UI**
- Gradient backgrounds with glass morphism effects
- Real-time animations and hover effects
- Responsive design for all devices
- Professional typography with Inter font
- Smooth transitions and micro-interactions

### 📊 **Real-time Monitoring**
- Live service status indicators with pulse animations
- Database connectivity status for each service
- Auto-refresh every 5 seconds
- Real-time activity feed with notifications
- Service response time tracking

### 🗄️ **Database Connectivity**
- MongoDB connection status for each service
- Visual database indicators with floating animations
- Connection pool monitoring
- Database health metrics

### 📈 **Advanced Analytics**
- Service metrics dashboard
- Request count tracking
- Average response time monitoring
- Active service count
- Database connection count

### 🔄 **Service Communication**
- Interactive Mermaid.js architecture diagram
- Service-to-service communication visualization
- API endpoint monitoring
- Cross-service dependency tracking

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Auth Service  │    │  Product Service│
│   Dashboard     │◄──►│   (Port 8081)   │    │   (Port 8082)   │
│   (Port 3000)   │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       ▼
         │              ┌─────────────────┐    ┌─────────────────┐
         │              │   Auth DB       │    │  Product DB     │
         │              │   MongoDB       │    │   MongoDB       │
         │              └─────────────────┘    └─────────────────┘
         │
         ▼
┌─────────────────┐    ┌─────────────────┐
│  Order Service  │    │   Order DB      │
│   (Port 8083)   │───►│   MongoDB       │
└─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- **Java 17+**
- **Node.js 16+**
- **MongoDB 5+**
- **Gradle 7+**

### 1. Clone & Setup
```bash
git clone <repository>
cd microservices
```

### 2. Environment Configuration
```bash
cp shared/env.example shared/.env
# Edit shared/.env with your configuration
```

### 3. Start MongoDB
```bash
mongod --dbpath /path/to/data/db
```

### 4. Start All Services

#### Option A: Individual Terminals
```bash
# Terminal 1: Auth Service
cd auth-service && ./gradlew bootRun

# Terminal 2: Product Service  
cd product-service && ./gradlew bootRun

# Terminal 3: Order Service
cd order-service && ./gradlew bootRun

# Terminal 4: Frontend Dashboard
cd frontend && npm start
```

#### Option B: Background Processes
```bash
# Start all services in background
cd auth-service && ./gradlew bootRun &
cd product-service && ./gradlew bootRun &
cd order-service && ./gradlew bootRun &
cd frontend && npm start &
```

### 5. Access Dashboard
- **🌐 Dashboard**: http://localhost:3000
- **🔐 Auth Service**: http://localhost:8081
- **📦 Product Service**: http://localhost:8082
- **🛒 Order Service**: http://localhost:8083

## 🧪 Test the APIs

### Authentication
```bash
# Register user
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","email":"admin@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'
```

### Products
```bash
# Create product
curl -X POST http://localhost:8082/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"MacBook Pro","description":"High-performance laptop","price":1999.99,"stock":50,"category":"Electronics"}'

# Get all products
curl http://localhost:8082/api/products
```

### Orders
```bash
# Create order (replace PRODUCT_ID with actual ID)
curl -X POST http://localhost:8083/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customerName":"John Doe","customerEmail":"john@example.com","items":[{"productId":"PRODUCT_ID","productName":"MacBook Pro","quantity":1,"price":1999.99}]}'

# Get all orders
curl http://localhost:8083/api/orders
```

## 🔧 Health Checks
```bash
curl http://localhost:8081/health  # Auth Service
curl http://localhost:8082/health  # Product Service
curl http://localhost:8083/health  # Order Service
```

## 📁 Project Structure
```
microservices/
├── frontend/                 # 🎨 Beautiful Dashboard
│   ├── server.js            # Express server
│   ├── views/
│   │   └── dashboard.ejs    # Stunning UI template
│   ├── public/
│   │   └── css/            # Tailwind CSS
│   └── package.json
├── auth-service/            # 🔐 Authentication
│   ├── build.gradle
│   └── src/main/java/
│       └── com/microservices/auth/
│           ├── controller/  # REST endpoints
│           ├── service/     # Business logic
│           ├── model/       # User entity
│           └── config/      # Security config
├── product-service/         # 📦 Product Management
│   ├── build.gradle
│   └── src/main/java/
│       └── com/microservices/product/
│           ├── controller/  # CRUD operations
│           ├── service/     # Product logic
│           └── model/       # Product entity
├── order-service/          # 🛒 Order Processing
│   ├── build.gradle
│   └── src/main/java/
│       └── com/microservices/order/
│           ├── controller/  # Order endpoints
│           ├── service/     # Order logic
│           └── model/       # Order entities
└── shared/                 # ⚙️ Configuration
    ├── .env               # Environment variables
    └── README.md
```

## 🎯 Dashboard Features

### Real-time Monitoring
- ✅ Service status with animated indicators
- ✅ Database connectivity status
- ✅ Response time tracking
- ✅ Auto-refresh every 5 seconds
- ✅ Live activity feed

### Visual Elements
- ✅ Glass morphism design
- ✅ Gradient backgrounds
- ✅ Hover animations
- ✅ Pulse effects for active services
- ✅ Floating database indicators

### Interactive Components
- ✅ Tooltips on hover
- ✅ Real-time notifications
- ✅ Interactive architecture diagram
- ✅ Service metrics cards
- ✅ Activity timeline

## 🛠️ Development

### Adding New Services
1. Create service directory with Spring Boot structure
2. Add health endpoint (`/health`)
3. Update `frontend/server.js` with service configuration
4. Add service to dashboard monitoring

### Customizing Dashboard
- Modify `frontend/views/dashboard.ejs` for UI changes
- Update `frontend/public/css/` for styling
- Configure service endpoints in `frontend/server.js`

### Environment Variables
```bash
# Frontend
FRONTEND_PORT=3000

# Services
AUTH_SERVICE_URL=http://localhost:8081
PRODUCT_SERVICE_URL=http://localhost:8082
ORDER_SERVICE_URL=http://localhost:8083

# MongoDB
MONGODB_URI=mongodb://localhost:27017

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=86400000
```

## 🔒 Security Features
- JWT-based authentication
- CORS configuration
- Password hashing with BCrypt
- Environment-based configuration
- Secure API endpoints

## 📊 Performance
- Real-time health checks
- Optimized database queries
- Efficient service communication
- Minimal resource usage
- Fast response times

## 🐛 Troubleshooting

### Common Issues
1. **MongoDB Connection Failed**
   - Ensure MongoDB is running
   - Check connection string in `.env`

2. **Service Won't Start**
   - Verify Java 17+ is installed
   - Check port availability
   - Review application logs

3. **Dashboard Not Loading**
   - Ensure all services are running
   - Check browser console for errors
   - Verify environment variables

### Logs
```bash
# View service logs
tail -f auth-service/logs/application.log
tail -f product-service/logs/application.log
tail -f order-service/logs/application.log
```

## 📈 Monitoring & Analytics
- Service uptime tracking
- Response time monitoring
- Database connection pooling
- API request analytics
- Error rate tracking

## 🤝 Contributing
1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License
MIT License - see LICENSE file for details

---

**🎉 Enjoy your beautiful microservices dashboard!** 