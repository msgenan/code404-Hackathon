#!/bin/bash

# Create backups directory if it doesn't exist
mkdir -p backups

# Timestamp for the filename
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="backups/hospital_db_$DATE.sql"

echo "Starting backup for hospital_db..."

# Dump the database from the 'appointment_postgres' container
if docker-compose exec -T appointment_postgres pg_dump -U postgres hospital_db > "$FILENAME"; then
    echo "✅ Backup successful: $FILENAME"
else
    echo "❌ Backup failed!"
    exit 1
fi
