# Server Dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy server files
COPY . .

# Expose port
EXPOSE 3001

# Start the app
CMD ["python", "server.py"]