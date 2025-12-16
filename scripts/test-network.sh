#!/bin/bash

# Network Testing Script for Docker Compose
# Tests internal connectivity between frontend and backend containers with retry logic

set -e

echo "🔍 Docker Compose Network Testing Script"
echo "=========================================="
echo ""

# Configuration
FRONTEND_CONTAINER="appointment_frontend"
BACKEND_SERVICE="backend"
BACKEND_URL="http://backend:8000/health"
MAX_RETRIES=5
RETRY_DELAY=2

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if frontend container exists and is running
echo "📦 Checking containers..."
if ! docker ps --format '{{.Names}}' | grep -q "^${FRONTEND_CONTAINER}$"; then
    echo -e "${RED}❌ FAILED: Frontend container '${FRONTEND_CONTAINER}' is not running${NC}"
    echo "Please run 'docker-compose up -d' first"
    exit 1
fi
echo -e "${GREEN}✅ Frontend container is running${NC}"

# Check if backend container exists and is running
if ! docker ps --format '{{.Names}}' | grep -q "appointment_backend"; then
    echo -e "${RED}❌ FAILED: Backend container is not running${NC}"
    echo "Please run 'docker-compose up -d' first"
    exit 1
fi
echo -e "${GREEN}✅ Backend container is running${NC}"

echo ""
echo "🌐 Testing network connectivity: frontend → ${BACKEND_URL}"
echo "-------------------------------------------"

# Retry loop to handle backend startup time
SUCCESS=false
for i in $(seq 1 $MAX_RETRIES); do
    echo -e "${BLUE}[Attempt $i/$MAX_RETRIES]${NC} Connecting to backend..."
    
    # Run wget from inside frontend container (Alpine has wget by default, not curl)
    if docker exec "$FRONTEND_CONTAINER" wget -q -O /dev/null --spider "$BACKEND_URL" 2>/dev/null; then
        SUCCESS=true
        break
    fi
    
    if [ $i -lt $MAX_RETRIES ]; then
        echo -e "${YELLOW}⏳ Backend not ready yet, retrying in ${RETRY_DELAY}s...${NC}"
        sleep $RETRY_DELAY
    fi
done

echo ""
echo "=========================================="
if [ "$SUCCESS" = true ]; then
    echo -e "${GREEN}✅ SUCCESS${NC}"
    echo "Frontend container can reach backend at ${BACKEND_URL}"
    echo "Network connectivity test passed!"
    exit 0
else
    echo -e "${RED}❌ FAILED${NC}"
    echo "Frontend container could not reach backend after $MAX_RETRIES attempts"
    echo ""
    echo "Troubleshooting:"
    echo "  1. Check backend logs: docker-compose logs backend"
    echo "  2. Verify backend is healthy: docker-compose ps"
    echo "  3. Check network: docker network ls"
    exit 1
fi
