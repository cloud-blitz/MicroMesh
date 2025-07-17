#!/bin/bash

# Microservices Deployment Script
echo "🚀 Starting Microservices Deployment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Remove old images (optional)
read -p "Do you want to remove old images? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️ Removing old images..."
    docker-compose down --rmi all
fi

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check service health
echo "🏥 Checking service health..."
docker-compose ps

# Show logs
echo "📋 Recent logs:"
docker-compose logs --tail=20

echo ""
echo "✅ Deployment completed!"
echo ""
echo "🌐 Access your application:"
echo "   Dashboard: http://localhost:3000"
echo "   Auth Service: http://localhost:8081"
echo "   Product Service: http://localhost:8082"
echo "   Order Service: http://localhost:8083"
echo "   MongoDB: localhost:27017"
echo ""
echo "📊 Monitor services:"
echo "   docker-compose ps"
echo "   docker-compose logs -f [service-name]"
echo ""
echo "🛑 To stop: docker-compose down" 