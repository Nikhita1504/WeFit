# Model Dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy model files
COPY . .

# Expose port
EXPOSE 5000

# Start the app
CMD ["python", "app.py"]