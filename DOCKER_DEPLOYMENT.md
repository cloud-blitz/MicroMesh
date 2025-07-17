# 🐳 Docker Deployment Guide

Complete guide to deploy the microservices application using Docker and Docker Compose.

## 📋 Prerequisites

- **Docker** (version 20.10+)
- **Docker Compose** (version 2.0+)
- **Git** (to clone the repository)

## 🚀 Quick Start

### 1. Clone and Navigate
```bash
git clone <repository-url>
cd microservices
```

### 2. Deploy with Script
```bash
# Make script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

### 3. Manual Deployment
```bash
# Build and start all services
docker-compose up --build -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Auth Service  │    │  Product Service│
│   (Port 3000)   │◄──►│   (Port 8081)   │    │   (Port 8082)   │
│   Container     │    │   Container     │    │   Container     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       ▼
         │              ┌─────────────────┐    ┌─────────────────┐
         │              │   MongoDB       │    │  MongoDB        │
         │              │   (Port 27017)  │    │   (Port 27017)  │
         │              │   Container     │    │   Container     │
         │              └─────────────────┘    └─────────────────┘
         │
         ▼
┌─────────────────┐    ┌─────────────────┐
│  Order Service  │    │   MongoDB       │
│   (Port 8083)   │───►│   (Port 27017)  │
│   Container     │    │   Container     │
└─────────────────┘    └─────────────────┘
```

## 📦 Services

### 🔐 Auth Service
- **Port**: 8081
- **Database**: auth_service_db
- **Features**: User registration, login, JWT authentication
- **Health Check**: `/health`

### 📦 Product Service
- **Port**: 8082
- **Database**: product_service_db
- **Features**: Product CRUD operations, inventory management
- **Health Check**: `/health`

### 🛒 Order Service
- **Port**: 8083
- **Database**: order_service_db
- **Features**: Order processing, stock management
- **Health Check**: `/health`

### 🎨 Frontend Dashboard
- **Port**: 3000
- **Features**: Real-time monitoring, service status, metrics
- **Health Check**: `/`

### 🗄️ MongoDB
- **Port**: 27017
- **Databases**: auth_service_db, product_service_db, order_service_db
- **Credentials**: admin/password123

## 🛠️ Docker Commands

### Basic Operations
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Restart all services
docker-compose restart

# View running containers
docker-compose ps

# View logs
docker-compose logs

# View logs for specific service
docker-compose logs -f auth-service
```

### Development Mode
```bash
# Start with development overrides
docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d

# This includes:
# - Volume mounts for live code changes
# - Debug logging
# - MongoDB Express (port 8080)
```

### Building and Rebuilding
```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build auth-service

# Rebuild and start
docker-compose up --build -d

# Remove all images and rebuild
docker-compose down --rmi all
docker-compose up --build -d
```

### Monitoring and Debugging
```bash
# Check service health
docker-compose ps

# View resource usage
docker stats

# Access container shell
docker-compose exec auth-service sh
docker-compose exec mongodb mongosh

# View container details
docker-compose exec auth-service java -version
```

## 🔧 Configuration

### Environment Variables
All environment variables are configured in `docker-compose.yml`:

```yaml
# MongoDB
MONGO_INITDB_ROOT_USERNAME: admin
MONGO_INITDB_ROOT_PASSWORD: password123

# Services
SPRING_DATA_MONGODB_URI: mongodb://admin:password123@mongodb:27017/service_db?authSource=admin
JWT_SECRET: your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION: 86400000
```

### Ports
- **Frontend**: 3000
- **Auth Service**: 8081
- **Product Service**: 8082
- **Order Service**: 8083
- **MongoDB**: 27017
- **MongoDB Express**: 8080 (development only)

### Networks
All services are connected via the `microservices-network` bridge network.

## 📊 Health Checks

Each service includes health checks:

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8081/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```

## 🗄️ Database Management

### MongoDB Express (Development)
Access MongoDB web interface at: http://localhost:8080
- **Username**: admin
- **Password**: password123

### Direct MongoDB Access
```bash
# Connect to MongoDB container
docker-compose exec mongodb mongosh -u admin -p password123

# List databases
show dbs

# Use specific database
use auth_service_db
show collections
```

## 🧪 Testing the Deployment

### 1. Check Service Health
```bash
curl http://localhost:8081/health  # Auth Service
curl http://localhost:8082/health  # Product Service
curl http://localhost:8083/health  # Order Service
```

### 2. Test API Endpoints
```bash
# Register user
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Create product
curl -X POST http://localhost:8082/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","description":"Test Description","price":99.99,"stock":10,"category":"Test"}'

# Get all products
curl http://localhost:8082/api/products
```

### 3. Access Dashboard
Open http://localhost:3000 in your browser to see the real-time dashboard.

## 🔍 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Check what's using the port
lsof -i :3000

# Stop conflicting services
sudo systemctl stop <service-name>
```

#### 2. MongoDB Connection Issues
```bash
# Check MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

#### 3. Service Won't Start
```bash
# Check service logs
docker-compose logs auth-service

# Check if dependencies are ready
docker-compose ps
```

#### 4. Build Failures
```bash
# Clean and rebuild
docker-compose down
docker system prune -f
docker-compose up --build -d
```

### Debug Commands
```bash
# View all container logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# Check container status
docker-compose ps

# Inspect container
docker-compose exec auth-service sh

# Check network connectivity
docker network ls
docker network inspect microservices_microservices-network
```

## 📈 Production Deployment

### Security Considerations
1. **Change default passwords** in production
2. **Use secrets management** for sensitive data
3. **Enable SSL/TLS** for external access
4. **Configure firewall rules**
5. **Use production-grade MongoDB**

### Scaling
```bash
# Scale specific service
docker-compose up -d --scale auth-service=3

# Use Docker Swarm for orchestration
docker swarm init
docker stack deploy -c docker-compose.yml microservices
```

### Monitoring
```bash
# Monitor resource usage
docker stats

# Set up logging aggregation
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 🧹 Cleanup

### Remove Everything
```bash
# Stop and remove containers
docker-compose down

# Remove volumes (WARNING: This deletes all data)
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Clean up Docker system
docker system prune -a
```

### Remove Specific Components
```bash
# Remove specific service
docker-compose rm auth-service

# Remove specific volume
docker volume rm microservices_mongodb_data
```

## 📚 Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Spring Boot Docker Guide](https://spring.io/guides/gs/spring-boot-docker/)
- [MongoDB Docker Guide](https://docs.mongodb.com/manual/installation/)
- [Node.js Docker Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

---

**🎉 Your microservices application is now ready for production deployment!** 