#!/bin/bash

# Smart Appointment System - Quick Setup Script
# This script helps developers quickly set up the project

set -e

echo "🚀 Smart Appointment System - Setup"
echo "===================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

echo "✅ Docker is running"

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ .env file created"
        echo "⚠️  Please edit .env file with your credentials if needed"
    else
        echo "⚠️  .env.example not found, creating default .env..."
        cat > .env << EOF
POSTGRES_USER=appointment_user
POSTGRES_PASSWORD=secure_password_123
POSTGRES_DB=appointment_db
POSTGRES_PORT=5432
REDIS_PORT=6379
EOF
        echo "✅ Default .env file created"
    fi
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🔧 Building and starting containers..."
echo "This may take a few minutes on first run..."
echo ""

# Try with BuildKit first
if DOCKER_BUILDKIT=1 docker-compose up --build -d 2>&1 | grep -q "failed to resolve"; then
    echo "⚠️  BuildKit DNS issue detected, using legacy builder..."
    DOCKER_BUILDKIT=0 docker-compose up --build -d
else
    echo "✅ Using BuildKit"
    DOCKER_BUILDKIT=1 docker-compose up --build -d
fi

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
if docker ps | grep -q appointment_nginx; then
    echo ""
    echo "✅ Setup complete! Services are running:"
    echo ""
    docker ps --filter "name=appointment" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo ""
    echo "🌐 Access the application:"
    echo "   Frontend:     http://localhost"
    echo "   Backend API:  http://localhost/api/health"
    echo "   Backend Docs: http://localhost/docs"
    echo ""
    echo "🔍 Debug access:"
    echo "   Frontend:     http://localhost:3001"
    echo "   Backend:      http://localhost:8001"
    echo ""
    echo "📊 Useful commands:"
    echo "   View logs:    docker-compose logs -f"
    echo "   Stop:         docker-compose down"
    echo "   Restart:      docker-compose restart"
    echo ""
else
    echo ""
    echo "❌ Something went wrong. Check logs:"
    echo "   docker-compose logs"
    exit 1
fi
