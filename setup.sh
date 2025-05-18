#!/bin/bash

# This script prepares your WeFit project for deployment on Render

# Ensure Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

# Ensure Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Copy Dockerfiles to their respective directories if they don't exist
if [ ! -f ./Frontend/Dockerfile ]; then
    echo "Copying Frontend Dockerfile..."
    cp ./Frontend_Dockerfile ./Frontend/Dockerfile
fi

if [ ! -f ./Admin/Dockerfile ]; then
    echo "Copying Admin Dockerfile..."
    cp ./Admin_Dockerfile ./Admin/Dockerfile
fi

if [ ! -f ./Backend/Dockerfile ]; then
    echo "Copying Backend Dockerfile..."
    cp ./Backend_Dockerfile ./Backend/Dockerfile
fi

if [ ! -f ./model/Dockerfile ]; then
    echo "Copying Model Dockerfile..."
    cp ./Model_Dockerfile ./model/Dockerfile
fi

if [ ! -f ./server/Dockerfile ]; then
    echo "Copying Server Dockerfile..."
    cp ./Server_Dockerfile ./server/Dockerfile
fi

# Test build all images
echo "Building Docker images for testing..."
docker-compose build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "Docker build successful. Ready for Render deployment!"
    echo "To deploy to Render:"
    echo "1. Push your code to a Git repository (GitHub, GitLab, etc.)"
    echo "2. Connect your repository to Render"
    echo "3. Choose 'Docker' as the environment"
    echo "4. Set the environment variables in Render dashboard"
else
    echo "Docker build failed. Please check the error messages above."
fi