#!/bin/bash

# Script to add test patients with incomplete profiles
# This helps test the profile completion feature

echo "➕ Adding test patients with incomplete profiles..."

# Get the backend container name
BACKEND_CONTAINER=$(docker-compose ps -q backend)

if [ -z "$BACKEND_CONTAINER" ]; then
    echo "❌ Error: Backend container not found"
    exit 1
fi

# Add patients with missing information
docker-compose exec -T backend python -c "
from sqlmodel import Session, select
from app.database import engine
from app.models import User, UserRole
from app.auth import hash_password

with Session(engine) as session:
    # Patient with only email and password (missing everything else)
    incomplete_patient1 = User(
        email='incomplete1@example.com',
        password_hash=hash_password('Patient123!'),
        role=UserRole.patient,
        full_name='Test User 1',
        # Missing: phone, age, gender, medical_history, allergies
    )
    
    # Patient with some info but missing medical details
    incomplete_patient2 = User(
        email='incomplete2@example.com',
        password_hash=hash_password('Patient123!'),
        role=UserRole.patient,
        full_name='Test User 2',
        phone='(555) 999-0001',
        age=30,
        gender='Female',
        # Missing: medical_history, allergies
    )
    
    # Patient with medical info but missing personal details
    incomplete_patient3 = User(
        email='incomplete3@example.com',
        password_hash=hash_password('Patient123!'),
        role=UserRole.patient,
        full_name='Test User 3',
        medical_history='Diabetes',
        allergies='None',
        # Missing: phone, age, gender
    )
    
    session.add(incomplete_patient1)
    session.add(incomplete_patient2)
    session.add(incomplete_patient3)
    session.commit()
    
    print('✅ Added 3 test patients with incomplete profiles:')
    print('   📧 incomplete1@example.com | Password: Patient123! | Missing: phone, age, gender, medical info')
    print('   📧 incomplete2@example.com | Password: Patient123! | Missing: medical history, allergies')
    print('   📧 incomplete3@example.com | Password: Patient123! | Missing: phone, age, gender')
"

echo ""
echo "✅ Test patients added successfully!"
echo "You can now log in with these accounts to test the profile completion feature."
