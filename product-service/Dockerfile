# Debug build for Product Service
FROM gradle:7.6.1-jdk17

WORKDIR /app

# Install curl and other debugging tools
RUN apt-get update && apt-get install -y curl tree && rm -rf /var/lib/apt/lists/*

# Copy the entire project
COPY . .

# Debug: Show what we copied
RUN echo "=== Contents of /app ===" && ls -la
RUN echo "=== Contents of src ===" && ls -la src/
RUN echo "=== Contents of build.gradle ===" && cat build.gradle

# Build the application with maximum verbosity
RUN gradle build -x test --debug --stacktrace

# Debug: Show what was built
RUN echo "=== Contents of build/ ===" && ls -la build/
RUN echo "=== Contents of build/libs/ ===" && ls -la build/libs/

# Try to find any JAR files
RUN echo "=== Finding JAR files ===" && find . -name "*.jar" -type f

# Copy the JAR file with explicit name
RUN cp build/libs/product-service-0.0.1-SNAPSHOT.jar app.jar

# Verify the JAR exists
RUN echo "=== Final JAR check ===" && ls -la app.jar

# Expose port
EXPOSE 8082

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8082/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"] 