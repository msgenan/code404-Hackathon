from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from prometheus_fastapi_instrumentator import Instrumentator
from sqlmodel import Session, select
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.api.appointment_routes import router as appointment_router
from app.api.auth_routes import router as auth_router
from app.api.doctor_routes import router as doctor_router
from app.api.health_routes import router as health_router
from app.api.patient_routes import router as patient_router
from app.api.user_routes import router as user_router
from app.auth import hash_password
from app.database import create_db_and_tables
from app.models import User, UserRole

app = FastAPI(
    title="Hospital Appointment Management API",
    description="Hackathon Project - Case 3: Hospital Appointment Management System",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Instrumentator().instrument(app).expose(app)

app.include_router(health_router)
app.include_router(auth_router)
app.include_router(doctor_router)
app.include_router(appointment_router)
app.include_router(patient_router)
app.include_router(user_router)
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "status_code": exc.status_code,
            "path": str(request.url.path),
        },
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    error_messages = []
    for error in errors:
        field = error.get("loc", [])[-1] if error.get("loc") else "unknown"
        msg = error.get("msg", "")
        if msg.startswith("Value error, "):
            msg = msg.replace("Value error, ", "")
        error_messages.append(f"{field}: {msg}")
    return JSONResponse(
        status_code=422,
        content={
            "detail": " | ".join(error_messages) if error_messages else "Validation error"
        },
    )


@app.on_event("startup")
def on_startup():
    """Runs at application startup - creates database tables and adds seed data"""
    from datetime import datetime, timedelta

    from app.database import engine
    from app.models import Appointment, AppointmentStatus

    create_db_and_tables()
    with Session(engine) as session:
        existing_users = session.exec(select(User)).all()

        if not existing_users:
            # Create Doctors
            doctors = [
                User(
                    email="sarah.chen@hospital.com",
                    password_hash=hash_password("Doctor123!"),
                    role=UserRole.doctor,
                    full_name="Dr. Sarah Chen",
                    department="Cardiology",
                    phone="(555) 100-0001",
                    age=42,
                    gender="Female"
                ),
                User(
                    email="michael.roberts@hospital.com",
                    password_hash=hash_password("Doctor123!"),
                    role=UserRole.doctor,
                    full_name="Dr. Michael Roberts",
                    department="Cardiology",
                    phone="(555) 100-0002",
                    age=48,
                    gender="Male"
                ),
                User(
                    email="emily.thompson@hospital.com",
                    password_hash=hash_password("Doctor123!"),
                    role=UserRole.doctor,
                    full_name="Dr. Emily Thompson",
                    department="Dermatology",
                    phone="(555) 100-0003",
                    age=38,
                    gender="Female"
                ),
                User(
                    email="james.wilson@hospital.com",
                    password_hash=hash_password("Doctor123!"),
                    role=UserRole.doctor,
                    full_name="Dr. James Wilson",
                    department="Orthopedics",
                    phone="(555) 100-0004",
                    age=52,
                    gender="Male"
                ),
                User(
                    email="maria.garcia@hospital.com",
                    password_hash=hash_password("Doctor123!"),
                    role=UserRole.doctor,
                    full_name="Dr. Maria Garcia",
                    department="Pediatrics",
                    phone="(555) 100-0005",
                    age=36,
                    gender="Female"
                ),
                User(
                    email="david.lee@hospital.com",
                    password_hash=hash_password("Doctor123!"),
                    role=UserRole.doctor,
                    full_name="Dr. David Lee",
                    department="Neurology",
                    phone="(555) 100-0006",
                    age=45,
                    gender="Male"
                ),
                User(
                    email="amara.chen@hospital.com",
                    password_hash=hash_password("Doctor123!"),
                    role=UserRole.doctor,
                    full_name="Dr. Amara Chen",
                    department="General Medicine",
                    phone="(555) 100-0007",
                    age=40,
                    gender="Female"
                ),
                User(
                    email="robert.smith@hospital.com",
                    password_hash=hash_password("Doctor123!"),
                    role=UserRole.doctor,
                    full_name="Dr. Robert Smith",
                    department="Gastroenterology",
                    phone="(555) 100-0008",
                    age=50,
                    gender="Male"
                ),
            ]

            for doctor in doctors:
                session.add(doctor)

            # Create Patients
            patients = [
                User(
                    email="patient@hospital.com",
                    password_hash=hash_password("Patient123!"),
                    role=UserRole.patient,
                    full_name="John Doe",
                    phone="(555) 123-4567",
                    age=45,
                    gender="Male",
                    medical_history="Hypertension, Type 2 Diabetes",
                    allergies="Penicillin"
                ),
                User(
                    email="jane.smith@example.com",
                    password_hash=hash_password("Patient123!"),
                    role=UserRole.patient,
                    full_name="Jane Smith",
                    phone="(555) 234-5678",
                    age=32,
                    gender="Female",
                    medical_history="Asthma",
                    allergies="None"
                ),
                User(
                    email="mike.johnson@example.com",
                    password_hash=hash_password("Patient123!"),
                    role=UserRole.patient,
                    full_name="Mike Johnson",
                    phone="(555) 345-6789",
                    age=58,
                    gender="Male",
                    medical_history="High cholesterol",
                    allergies="Sulfa drugs"
                ),
                User(
                    email="sarah.williams@example.com",
                    password_hash=hash_password("Patient123!"),
                    role=UserRole.patient,
                    full_name="Sarah Williams",
                    phone="(555) 456-7890",
                    age=28,
                    gender="Female",
                    medical_history="None",
                    allergies="Latex"
                ),
                User(
                    email="aziz.karim@example.com",
                    password_hash=hash_password("Patient123!"),
                    role=UserRole.patient,
                    full_name="Aziz Karim",
                    phone="(555) 567-8901",
                    age=35,
                    gender="Male",
                    medical_history="Chest Pain",
                    allergies="None"
                ),
                User(
                    email="leila.aydin@example.com",
                    password_hash=hash_password("Patient123!"),
                    role=UserRole.patient,
                    full_name="Leila Aydin",
                    phone="(555) 678-9012",
                    age=29,
                    gender="Female",
                    medical_history="Fever",
                    allergies="None"
                ),
                User(
                    email="marcus.lee@example.com",
                    password_hash=hash_password("Patient123!"),
                    role=UserRole.patient,
                    full_name="Marcus Lee",
                    phone="(555) 789-0123",
                    age=42,
                    gender="Male",
                    medical_history="Severe Headache",
                    allergies="Aspirin"
                ),
            ]

            for patient in patients:
                session.add(patient)

            session.commit()

            # Create sample appointments for today
            today = datetime.now().replace(hour=9, minute=0, second=0, microsecond=0)

            appointments = [
                Appointment(
                    doctor_id=1,  # Dr. Sarah Chen
                    patient_id=9,  # John Doe
                    start_time=today,
                    appointment_type="Consultation",
                    notes="Follow-up on medication adjustments",
                    status=AppointmentStatus.active
                ),
                Appointment(
                    doctor_id=1,
                    patient_id=10,  # Jane Smith
                    start_time=today + timedelta(hours=1),
                    appointment_type="Follow-up",
                    notes="Review test results",
                    status=AppointmentStatus.active
                ),
                Appointment(
                    doctor_id=1,
                    patient_id=11,  # Mike Johnson
                    start_time=today + timedelta(hours=5),
                    appointment_type="Check-up",
                    notes="Annual physical examination",
                    status=AppointmentStatus.active
                ),
                Appointment(
                    doctor_id=1,
                    patient_id=12,  # Sarah Williams
                    start_time=today + timedelta(hours=6, minutes=30),
                    appointment_type="Consultation",
                    notes="New patient consultation",
                    status=AppointmentStatus.active
                ),
            ]

            for appointment in appointments:
                session.add(appointment)

            session.commit()
            print("✅ Seed data added: 8 Doctors, 7 Patients, 4 Appointments")

