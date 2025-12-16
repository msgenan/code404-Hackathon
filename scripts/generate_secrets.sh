#!/bin/bash
# Generate secure SECRET_KEY for production use
# Usage: ./scripts/generate_secrets.sh

echo "🔐 Generating Secure Secrets"
echo "=============================="
echo ""

# Generate SECRET_KEY
SECRET_KEY=$(openssl rand -hex 32)
echo "SECRET_KEY for .env file:"
echo "SECRET_KEY=$SECRET_KEY"
echo ""

# Generate PostgreSQL password
POSTGRES_PASSWORD=$(openssl rand -base64 24 | tr -d "=+/" | cut -c1-24)
echo "POSTGRES_PASSWORD for .env file:"
echo "POSTGRES_PASSWORD=$POSTGRES_PASSWORD"
echo ""

echo "⚠️  Important:"
echo "1. Copy these values to your .env file"
echo "2. Never commit .env file to git"
echo "3. Keep these secrets secure"
echo ""
echo "Example .env update:"
echo "===================="
echo "SECRET_KEY=$SECRET_KEY"
echo "POSTGRES_PASSWORD=$POSTGRES_PASSWORD"
