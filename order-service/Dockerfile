# Build and run Order Service
FROM gradle:7.6.1-jdk17

WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy the entire project
COPY . .

# Build the application
RUN gradle build -x test

# List what was built for debugging
RUN echo "=== Build output ===" && ls -la build/libs/

# Copy the JAR to a known location
RUN cp build/libs/*.jar app.jar

# Verify the JAR exists
RUN echo "=== Final JAR check ===" && ls -la app.jar

# Expose port
EXPOSE 8083

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8083/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"] 