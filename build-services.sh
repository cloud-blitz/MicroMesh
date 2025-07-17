#!/bin/bash

# Build script for microservices
echo "Building Java services..."

# Function to build a service
build_service() {
    local service_name=$1
    local service_dir=$2
    
    echo "Building $service_name..."
    cd "$service_dir"
    
    # Check if gradlew exists, if not create it
    if [ ! -f "gradlew" ]; then
        echo "Creating Gradle wrapper for $service_name..."
        gradle wrapper
    fi
    
    # Build the service
    ./gradlew build -x test
    if [ $? -ne 0 ]; then
        echo "Failed to build $service_name"
        exit 1
    fi
    
    echo "$service_name built successfully!"
    cd ..
}

# Build Auth Service
build_service "Auth Service" "auth-service"

# Build Product Service
build_service "Product Service" "product-service"

# Build Order Service
build_service "Order Service" "order-service"

echo "All services built successfully!"
echo "You can now run: docker compose up" 