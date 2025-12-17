#!/bin/bash

# Database Reset Script for Hospital Appointment System
# This script will clear and reseed the database with fresh data

set -e  # Exit on error

echo "🔄 Resetting Hospital Database..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if docker-compose is running
if ! docker-compose ps | grep -q "Up"; then
    echo -e "${RED}❌ Error: Docker containers are not running${NC}"
    echo "Please start the containers first with: docker-compose up -d"
    exit 1
fi

echo -e "${YELLOW}⚠️  This will DELETE all data in the database!${NC}"
echo "This includes:"
echo "  - All users (doctors and patients)"
echo "  - All appointments"
echo "  - All medical records"
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirmation

if [ "$confirmation" != "yes" ]; then
    echo -e "${YELLOW}❌ Operation cancelled${NC}"
    exit 0
fi

echo -e "${GREEN}📋 Step 1: Dropping all tables...${NC}"
docker-compose exec -T db psql -U postgres -d hospital_db -c "
    DROP TABLE IF EXISTS appointments CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
    DROP TYPE IF EXISTS userrole CASCADE;
    DROP TYPE IF EXISTS appointmentstatus CASCADE;
" 2>/dev/null || true

echo -e "${GREEN}✅ Tables dropped${NC}"

echo -e "${GREEN}🔄 Step 2: Restarting backend to recreate tables and seed data...${NC}"
docker-compose restart backend

echo -e "${GREEN}⏳ Waiting for backend to initialize (10 seconds)...${NC}"
sleep 10

echo -e "${GREEN}✅ Database has been reset!${NC}"
echo ""
echo "New default accounts:"
echo -e "${YELLOW}Doctors:${NC}"
echo "  📧 sarah.chen@hospital.com        | 🔑 Doctor123!"
echo "  📧 michael.roberts@hospital.com   | 🔑 Doctor123!"
echo "  📧 emily.thompson@hospital.com    | 🔑 Doctor123!"
echo "  📧 james.wilson@hospital.com      | 🔑 Doctor123!"
echo "  📧 maria.garcia@hospital.com      | 🔑 Doctor123!"
echo "  📧 david.lee@hospital.com         | 🔑 Doctor123!"
echo "  📧 amara.chen@hospital.com        | 🔑 Doctor123!"
echo "  📧 robert.smith@hospital.com      | 🔑 Doctor123!"
echo ""
echo -e "${YELLOW}Patients:${NC}"
echo "  📧 patient@hospital.com           | 🔑 Patient123!"
echo "  📧 jane.smith@example.com         | 🔑 Patient123!"
echo "  📧 mike.johnson@example.com       | 🔑 Patient123!"
echo "  📧 sarah.williams@example.com     | 🔑 Patient123!"
echo "  📧 aziz.karim@example.com         | 🔑 Patient123!"
echo "  📧 leila.aydin@example.com        | 🔑 Patient123!"
echo "  📧 marcus.lee@example.com         | 🔑 Patient123!"
echo ""
echo -e "${GREEN}✅ Reset complete! You can now log in with any of the accounts above.${NC}"
