#!/bin/bash

# Build script for microservices
echo "Building Java services..."

# Build Auth Service
echo "Building Auth Service..."
cd auth-service
./gradlew build -x test
if [ $? -ne 0 ]; then
    echo "Failed to build Auth Service"
    exit 1
fi
cd ..

# Build Product Service
echo "Building Product Service..."
cd product-service
./gradlew build -x test
if [ $? -ne 0 ]; then
    echo "Failed to build Product Service"
    exit 1
fi
cd ..

# Build Order Service
echo "Building Order Service..."
cd order-service
./gradlew build -x test
if [ $? -ne 0 ]; then
    echo "Failed to build Order Service"
    exit 1
fi
cd ..

echo "All services built successfully!"
echo "You can now run: docker compose up" 