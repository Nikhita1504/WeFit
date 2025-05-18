# Root Dockerfile for Render deployment
FROM docker/compose:1.29.2

WORKDIR /app

# Copy docker-compose file and all project files
COPY docker-compose.yml .
COPY . .

# Expose all necessary ports
EXPOSE 5173 5174 3000 5000 3001

# Start all services using docker-compose
CMD ["docker-compose", "up"]