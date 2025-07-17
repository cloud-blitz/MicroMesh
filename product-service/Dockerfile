# Multi-stage build for Product Service
FROM gradle:7.6.1-jdk17 AS build

WORKDIR /app
COPY . .

# Build the application with verbose output
RUN gradle build -x test --info

# List the built JAR files for debugging
RUN echo "=== Build directory contents ===" && ls -la build/
RUN echo "=== Libs directory contents ===" && ls -la build/libs/

# Runtime stage
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Copy the built JAR from build stage - handle Spring Boot naming
COPY --from=build /app/build/libs/product-service-*.jar app.jar

# List files for debugging
RUN echo "=== Runtime directory contents ===" && ls -la

# Expose port
EXPOSE 8082

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8082/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"] 