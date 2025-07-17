# Multi-stage build for Order Service
FROM gradle:7.6.1-jdk17 AS build

WORKDIR /app
COPY . .

# Build the application
RUN gradle build -x test

# Runtime stage
FROM openjdk:17-jre-slim

WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy the built JAR from build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Expose port
EXPOSE 8083

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8083/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"] 