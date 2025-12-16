#!/bin/bash

# Network Testing Script for Docker Compose
# Tests internal connectivity between frontend and backend containers

set -e

echo "🔍 Docker Compose Network Testing Script"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker Compose is running
echo "📦 Checking Docker Compose status..."
if ! docker-compose ps >/dev/null 2>&1; then
    echo -e "${RED}❌ ERROR: Docker Compose is not running${NC}"
    echo "Please run 'docker-compose up -d' first"
    exit 1
fi

# Check if frontend container is running
echo "🔍 Checking frontend container..."
FRONTEND_CONTAINER=$(docker-compose ps -q frontend 2>/dev/null)
if [ -z "$FRONTEND_CONTAINER" ]; then
    echo -e "${RED}❌ Frontend container is not running${NC}"
    exit 1
fi

FRONTEND_STATUS=$(docker inspect -f '{{.State.Status}}' "$FRONTEND_CONTAINER" 2>/dev/null)
if [ "$FRONTEND_STATUS" != "running" ]; then
    echo -e "${RED}❌ Frontend container is not in running state: $FRONTEND_STATUS${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Frontend container is running${NC}"

# Check if backend container is running
echo "🔍 Checking backend container..."
BACKEND_CONTAINER=$(docker-compose ps -q backend 2>/dev/null)
if [ -z "$BACKEND_CONTAINER" ]; then
    echo -e "${RED}❌ Backend container is not running${NC}"
    exit 1
fi

BACKEND_STATUS=$(docker inspect -f '{{.State.Status}}' "$BACKEND_CONTAINER" 2>/dev/null)
if [ "$BACKEND_STATUS" != "running" ]; then
    echo -e "${RED}❌ Backend container is not in running state: $BACKEND_STATUS${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Backend container is running${NC}"

echo ""
echo "🌐 Testing internal network connectivity..."
echo "-------------------------------------------"

# Test 1: Backend health check from frontend container
echo "Test 1: Frontend → Backend health check"
if docker exec "$FRONTEND_CONTAINER" curl -f -s http://appointment_backend:8000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend can reach backend /health endpoint${NC}"
else
    echo -e "${RED}❌ Frontend cannot reach backend /health endpoint${NC}"
    exit 1
fi

# Test 2: Backend docs from frontend container
echo "Test 2: Frontend → Backend /docs"
if docker exec "$FRONTEND_CONTAINER" curl -f -s -o /dev/null -w "%{http_code}" http://appointment_backend:8000/docs | grep -q "200"; then
    echo -e "${GREEN}✅ Frontend can reach backend /docs endpoint${NC}"
else
    echo -e "${YELLOW}⚠️  Backend /docs endpoint returned non-200 status${NC}"
fi

# Test 3: DNS resolution
echo "Test 3: DNS resolution check"
if docker exec "$FRONTEND_CONTAINER" sh -c "getent hosts appointment_backend" > /dev/null 2>&1; then
    BACKEND_IP=$(docker exec "$FRONTEND_CONTAINER" sh -c "getent hosts appointment_backend | awk '{ print \$1 }'")
    echo -e "${GREEN}✅ DNS resolution successful: appointment_backend → $BACKEND_IP${NC}"
else
    echo -e "${RED}❌ DNS resolution failed for appointment_backend${NC}"
    exit 1
fi

# Test 4: Network name check
echo "Test 4: Network configuration"
FRONTEND_NETWORK=$(docker inspect -f '{{range $net,$v := .NetworkSettings.Networks}}{{$net}}{{end}}' "$FRONTEND_CONTAINER")
BACKEND_NETWORK=$(docker inspect -f '{{range $net,$v := .NetworkSettings.Networks}}{{$net}}{{end}}' "$BACKEND_CONTAINER")

if [ "$FRONTEND_NETWORK" == "$BACKEND_NETWORK" ]; then
    echo -e "${GREEN}✅ Both containers are on the same network: $FRONTEND_NETWORK${NC}"
else
    echo -e "${RED}❌ Containers are on different networks${NC}"
    echo "   Frontend: $FRONTEND_NETWORK"
    echo "   Backend:  $BACKEND_NETWORK"
    exit 1
fi

echo ""
echo "=========================================="
echo -e "${GREEN}✅ All network tests passed!${NC}"
echo "=========================================="
echo ""
echo "📊 Container Details:"
echo "   Frontend: $(docker-compose ps frontend | tail -n 1 | awk '{print $1}')"
echo "   Backend:  $(docker-compose ps backend | tail -n 1 | awk '{print $1}')"
echo "   Network:  $FRONTEND_NETWORK"
