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
    
    # Make gradlew executable
    chmod +x gradlew
    
    # Build the service
    echo "Building $service_name with Gradle..."
    ./gradlew build -x test --info
    
    if [ $? -ne 0 ]; then
        echo "Failed to build $service_name"
        echo "Build output:"
        ./gradlew build -x test --stacktrace
        exit 1
    fi
    
    # Verify JAR was created
    if [ ! -f "build/libs/*.jar" ]; then
        echo "No JAR file found in build/libs/ for $service_name"
        echo "Contents of build/libs/:"
        ls -la build/libs/
        exit 1
    fi
    
    echo "$service_name built successfully!"
    echo "JAR files in build/libs/:"
    ls -la build/libs/
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