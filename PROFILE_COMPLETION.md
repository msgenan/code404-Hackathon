# Profile Completion Feature

## Overview

The system now includes a profile completion feature that:
- Detects when users have incomplete profile information
- Shows a notification banner on the dashboard
- Provides a modal form to fill in missing details
- Tracks completion percentage

## Features

### 1. Profile Completion Check
- Automatically checks if user profile is complete on dashboard load
- Required fields for **all users**: full_name, phone, age, gender
- Additional required fields for **patients**: medical_history, allergies
- Calculates completion percentage

### 2. Notification Banner
- Shows at the top of dashboard when profile is incomplete
- Displays completion percentage
- Can be dismissed temporarily with "Remind me later"
- Has a "Complete Profile" button to open the form

### 3. Profile Completion Modal
- Pre-fills existing information
- Only shows fields that are missing
- Validates all inputs before submission
- Updates profile in real-time

### 4. Database Management Scripts

#### Reset Database
To completely reset the database with fresh seed data:

```bash
./scripts/reset_database.sh
```

This will:
- Drop all tables
- Recreate tables
- Reseed with 8 doctors and 7 patients
- Display all account credentials

#### Add Test Patients with Incomplete Profiles
To add test patients for testing the profile completion feature:

```bash
./scripts/add_incomplete_patients.sh
```

This adds 3 test patients:
- `incomplete1@example.com` - Missing: phone, age, gender, medical info
- `incomplete2@example.com` - Missing: medical history, allergies  
- `incomplete3@example.com` - Missing: phone, age, gender

All test patients use password: `Patient123!`

## API Endpoints

### Check Profile Completion
```http
GET /users/profile-completion
Authorization: Bearer <token>
```

Response:
```json
{
  "is_complete": false,
  "completion_percentage": 66,
  "missing_fields": ["medical_history", "allergies"],
  "total_fields": 6,
  "completed_fields": 4
}
```

### Update Profile
```http
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "full_name": "John Doe",
  "phone": "(555) 123-4567",
  "age": 35,
  "gender": "Male",
  "medical_history": "None",
  "allergies": "Penicillin"
}
```

## Usage

### For Testing

1. **Test with incomplete profile:**
   ```bash
   # Add test patients
   ./scripts/add_incomplete_patients.sh
   
   # Login with incomplete1@example.com / Patient123!
   # You'll see the notification banner
   ```

2. **Complete the profile:**
   - Click "Complete Profile" button
   - Fill in the missing fields
   - Click "Save Profile"
   - Banner disappears automatically

3. **Reset database when needed:**
   ```bash
   ./scripts/reset_database.sh
   ```

### Default Accounts

**Doctors** (all use `Doctor123!`):
- sarah.chen@hospital.com
- michael.roberts@hospital.com
- emily.thompson@hospital.com
- james.wilson@hospital.com
- maria.garcia@hospital.com
- david.lee@hospital.com
- amara.chen@hospital.com
- robert.smith@hospital.com

**Patients** (all use `Patient123!`):
- patient@hospital.com
- jane.smith@example.com
- mike.johnson@example.com
- sarah.williams@example.com
- aziz.karim@example.com
- leila.aydin@example.com
- marcus.lee@example.com

## Technical Details

### Frontend Components
- `ProfileCompletionModal.tsx` - Modal form component
- Profile completion integrated into `UserDashboard.tsx`

### Backend API
- `user_routes.py` - Profile management endpoints
- Profile completion check logic
- Update validation

### Database
All scripts use Docker Compose to interact with the database container safely.
