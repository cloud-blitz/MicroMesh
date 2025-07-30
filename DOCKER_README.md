# Docker Setup for Microservices

This document provides instructions for running the microservices using individual Docker commands.

## Prerequisites

- Docker (version 20.10 or higher)

## Services Overview

The microservices architecture includes:

1. **Auth Service** (Port 8081) - Authentication and authorization
2. **Product Service** (Port 8082) - Product management
3. **Order Service** (Port 8083) - Order processing
4. **MongoDB** (Port 27017) - Database

## Quick Start

### 1. Start MongoDB

First, you'll need to run MongoDB separately:

```bash
# Run MongoDB container
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  -v mongodb_data:/data/db \
  mongo:7.0
```

### 2. Build Services

```bash
# Build auth service
docker build -t auth-service ./auth-service

# Build product service
docker build -t product-service ./product-service

# Build order service
docker build -t order-service ./order-service
```

### 3. Run Services

```bash
# Run auth service
docker run -d \
  --name auth-service \
  -p 8081:8081 \
  -e SPRING_DATA_MONGODB_URI=mongodb://admin:password@host.docker.internal:27017/auth_service_db?authSource=admin \
  -e JWT_SECRET=your-super-secret-jwt-key-change-in-production \
  -e JWT_EXPIRATION=86400000 \
  auth-service

# Run product service
docker run -d \
  --name product-service \
  -p 8082:8082 \
  -e SPRING_DATA_MONGODB_URI=mongodb://admin:password@host.docker.internal:27017/product_service_db?authSource=admin \
  product-service

# Run order service
docker run -d \
  --name order-service \
  -p 8083:8083 \
  -e SPRING_DATA_MONGODB_URI=mongodb://admin:password@host.docker.internal:27017/order_service_db?authSource=admin \
  -e PRODUCT_SERVICE_URL=http://host.docker.internal:8082 \
  order-service
```

### 4. Check Service Status

```bash
# View running containers
docker ps

# View logs
docker logs auth-service
docker logs product-service
docker logs order-service
docker logs mongodb
```

### 5. Stop Services

```bash
# Stop all services
docker stop auth-service product-service order-service mongodb

# Remove containers
docker rm auth-service product-service order-service mongodb

# Remove volumes (WARNING: This will delete all data)
docker volume rm mongodb_data
```

## Individual Service Management

### Build Individual Services

```bash
# Build auth service only
docker build -t auth-service ./auth-service

# Build product service only
docker build -t product-service ./product-service

# Build order service only
docker build -t order-service ./order-service
```

### Run Individual Services

```bash
# Start MongoDB first
docker run -d --name mongodb -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  -v mongodb_data:/data/db \
  mongo:7.0

# Start auth service
docker run -d --name auth-service -p 8081:8081 \
  -e SPRING_DATA_MONGODB_URI=mongodb://admin:password@host.docker.internal:27017/auth_service_db?authSource=admin \
  -e JWT_SECRET=your-super-secret-jwt-key-change-in-production \
  -e JWT_EXPIRATION=86400000 \
  auth-service

# Start product service
docker run -d --name product-service -p 8082:8082 \
  -e SPRING_DATA_MONGODB_URI=mongodb://admin:password@host.docker.internal:27017/product_service_db?authSource=admin \
  product-service

# Start order service
docker run -d --name order-service -p 8083:8083 \
  -e SPRING_DATA_MONGODB_URI=mongodb://admin:password@host.docker.internal:27017/order_service_db?authSource=admin \
  -e PRODUCT_SERVICE_URL=http://host.docker.internal:8082 \
  order-service
```

## Service Endpoints

Once all services are running, you can access:

- **Auth Service**: http://localhost:8081
  - Health Check: http://localhost:8081/actuator/health
  - API Documentation: http://localhost:8081/swagger-ui.html (if available)

- **Product Service**: http://localhost:8082
  - Health Check: http://localhost:8082/actuator/health
  - API Documentation: http://localhost:8082/swagger-ui.html (if available)

- **Order Service**: http://localhost:8083
  - Health Check: http://localhost:8083/actuator/health
  - API Documentation: http://localhost:8083/swagger-ui.html (if available)

- **MongoDB**: mongodb://localhost:27017
  - Username: admin
  - Password: password

## Environment Variables

The services use the following environment variables:

### Auth Service
- `SPRING_DATA_MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_EXPIRATION`: JWT token expiration time in milliseconds

### Product Service
- `SPRING_DATA_MONGODB_URI`: MongoDB connection string

### Order Service
- `SPRING_DATA_MONGODB_URI`: MongoDB connection string
- `PRODUCT_SERVICE_URL`: URL of the product service

## Database Configuration

MongoDB is configured with:
- **Username**: admin
- **Password**: password
- **Databases**: 
  - auth_service_db
  - product_service_db
  - order_service_db

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   lsof -i :8081
   lsof -i :8082
   lsof -i :8083
   lsof -i :27017
   
   # Stop the conflicting container
   docker stop <container-name>
   ```

2. **Service Not Starting**
   ```bash
   # Check logs
   docker logs <container-name>
   
   # Check if MongoDB is accessible
   docker exec -it mongodb mongosh -u admin -p password
   ```

3. **Build Failures**
   ```bash
   # Clean and rebuild
   docker system prune -f
   docker build --no-cache -t <service-name> ./<service-directory>
   ```

4. **Network Connectivity Issues**
   ```bash
   # Check if containers can reach each other
   docker exec -it <container-name> ping host.docker.internal
   
   # For Linux, you might need to use the host IP instead of host.docker.internal
   # Replace host.docker.internal with your host IP in the environment variables
   ```

### Health Checks

All services include health checks. You can monitor them:

```bash
# Check container status
docker ps

# View health check logs
docker inspect <container-name> | grep -A 10 "Health"
```

## Development

### Rebuilding After Code Changes

```bash
# Rebuild a specific service
docker build -t <service-name> ./<service-directory>

# Stop and remove the old container
docker stop <container-name>
docker rm <container-name>

# Run the new container
docker run -d --name <container-name> -p <port>:<port> <service-name>
```

### Accessing Service Logs

```bash
# Follow logs in real-time
docker logs -f <container-name>

# View recent logs
docker logs --tail 100 <container-name>
```

### Executing Commands in Containers

```bash
# Access MongoDB shell
docker exec -it mongodb mongosh -u admin -p password

# Access service container
docker exec -it auth-service sh
docker exec -it product-service sh
docker exec -it order-service sh
```

## Production Considerations

For production deployment, consider:

1. **Security**:
   - Change default passwords
   - Use environment variables for sensitive data
   - Enable MongoDB authentication
   - Use secrets management

2. **Performance**:
   - Configure JVM memory settings
   - Use production-grade MongoDB
   - Implement proper logging
   - Set up monitoring and alerting

3. **Scalability**:
   - Use external MongoDB cluster
   - Implement service discovery
   - Set up load balancing
   - Configure proper networking

4. **Networking**:
   - Use Docker networks for service communication
   - Configure proper DNS resolution
   - Set up reverse proxy/load balancer

## Cleanup

```bash
# Stop all containers
docker stop $(docker ps -q)

# Remove all containers
docker rm $(docker ps -aq)

# Remove all images
docker rmi $(docker images -q)

# Remove all unused Docker resources
docker system prune -a

# Remove volumes (WARNING: This will delete all data)
docker volume prune
```

## Alternative: Using Docker Networks

For better service communication, you can create a custom network:

```bash
# Create a custom network
docker network create microservices-network

# Run MongoDB with the network
docker run -d --name mongodb --network microservices-network \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  -v mongodb_data:/data/db \
  mongo:7.0

# Run services with the network (use container names instead of host.docker.internal)
docker run -d --name auth-service --network microservices-network -p 8081:8081 \
  -e SPRING_DATA_MONGODB_URI=mongodb://admin:password@mongodb:27017/auth_service_db?authSource=admin \
  -e JWT_SECRET=your-super-secret-jwt-key-change-in-production \
  -e JWT_EXPIRATION=86400000 \
  auth-service

docker run -d --name product-service --network microservices-network -p 8082:8082 \
  -e SPRING_DATA_MONGODB_URI=mongodb://admin:password@mongodb:27017/product_service_db?authSource=admin \
  product-service

docker run -d --name order-service --network microservices-network -p 8083:8083 \
  -e SPRING_DATA_MONGODB_URI=mongodb://admin:password@mongodb:27017/order_service_db?authSource=admin \
  -e PRODUCT_SERVICE_URL=http://product-service:8082 \
  order-service
``` 