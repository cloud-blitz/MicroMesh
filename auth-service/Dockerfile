# Single-stage build for Auth Service
FROM gradle:7.6.1-jdk17

WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy the entire project
COPY . .

# Build the application
RUN gradle build -x test

# Find and copy the built JAR
RUN find build/libs -name "*.jar" -exec cp {} app.jar \;

# Verify the JAR exists
RUN ls -la app.jar

# Expose port
EXPOSE 8081

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8081/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"] 