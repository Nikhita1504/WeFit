# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "index.js"]