# Multi-stage build for Product Service
FROM gradle:8.5-jdk17 AS build

# Set working directory
WORKDIR /app

# Copy gradle files
COPY build.gradle settings.gradle* ./
COPY gradle gradle
COPY gradlew ./

# Download dependencies
RUN gradle dependencies --no-daemon

# Copy source code
COPY src src

# Build the application
RUN gradle build --no-daemon

# Runtime stage
FROM openjdk:17-jre-slim

# Set working directory
WORKDIR /app

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Copy the built jar from build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Change ownership to non-root user
RUN chown appuser:appuser app.jar

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8082

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8082/actuator/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"] 