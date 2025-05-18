# Admin Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Build the app
ENV NODE_ENV=production
RUN npm run build

# Expose port
EXPOSE 5173

# Start the app
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]