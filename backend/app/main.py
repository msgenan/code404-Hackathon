from fastapi import FastAPI, Request, Depends, HTTPException, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator
from starlette.exceptions import HTTPException as StarletteHTTPException
from sqlmodel import Session, select
from datetime import datetime, timedelta
from typing import List
import redis

from app.database import create_db_and_tables, get_session
from app.models import (
    User, Appointment, UserCreate, UserLogin, UserRead,
    AppointmentCreate, AppointmentRead, Token, UserRole, AppointmentStatus
)
from app.auth import (
    hash_password, authenticate_user, create_access_token, get_current_user
)

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
redis_client = redis.Redis(host='appointment_redis', port=6379, db=0, decode_responses=True)
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
    from app.database import engine
    create_db_and_tables()
    with Session(engine) as session:
        existing_users = session.exec(select(User)).all()
        
        if not existing_users:
            doctor = User(
                email="doCtor@hospital.com",
                password_hash=hash_password("doCtor123"),
                role=UserRole.doctor,
                full_name="Dr. Ahmet Yilmaz"
            )
            session.add(doctor)
            patient = User(
                email="patient@hospital.com",
                password_hash=hash_password("patient123"),
                role=UserRole.patient,
                full_name="Mehmet Demir"
            )
            session.add(patient)
            session.commit()
            print("✅ Seed data added: 1 Doctor, 1 Patient")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "message": "Hastane Randevu Sistemi çalışıyor"}

@app.post("/auth/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, session: Session = Depends(get_session)):
    """User registration endpoint"""
    try:
        existing_user = session.exec(select(User).where(User.email == user_data.email)).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This email is already registered"
            )
        new_user = User(
            email=user_data.email,
            password_hash=hash_password(user_data.password),
            role=UserRole.patient,
            full_name=user_data.full_name
        )
        session.add(new_user)
        session.commit()
        session.refresh(new_user)
        return new_user
    
    except HTTPException:
        raise
    except ValueError as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during registration: {str(e)}"
        )

@app.post("/auth/login", response_model=Token)
async def login(login_data: UserLogin, session: Session = Depends(get_session)):
    """User login - returns JWT token"""
    user = authenticate_user(login_data.email, login_data.password, session)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email veya şifre hatalı",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.id})
    
    return Token(access_token=access_token)

@app.get("/doctors", response_model=List[UserRead])
async def get_doctors(session: Session = Depends(get_session)):
    """List only users with doctor role"""
    doctors = session.exec(select(User).where(User.role == UserRole.doctor)).all()
    return doctors


@app.post("/appointments", response_model=AppointmentRead, status_code=status.HTTP_201_CREATED)
async def create_appointment(
    appointment_data: AppointmentCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Create appointment (Only users with patient role)
    Checks for double booking and doctor availability
    """
    if current_user.role != UserRole.patient:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can create appointments"
        )
    lock_key = f"lock:appointment:{appointment_data.doctor_id}:{appointment_data.start_time}"
    is_locked = redis_client.set(lock_key, "locked", ex=10, nx=True)
    if not is_locked:
        raise HTTPException(status_code=409, detail="This time slot is currently being processed by another user. Please try again.")
    doctor = session.get(User, appointment_data.doctor_id)
    if not doctor or doctor.role != UserRole.doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found"
        )
    appointment_end_time = appointment_data.start_time + timedelta(hours=1)
    conflicting_appointment = session.exec(
        select(Appointment).where(
            Appointment.doctor_id == appointment_data.doctor_id,
            Appointment.status == AppointmentStatus.active,
            Appointment.start_time < appointment_end_time,
            Appointment.start_time >= appointment_data.start_time - timedelta(hours=1)
        )
    ).first()
    if conflicting_appointment:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This doctor has another appointment at the selected time"
        )
    new_appointment = Appointment(
        doctor_id=appointment_data.doctor_id,
        patient_id=current_user.id,
        start_time=appointment_data.start_time,
        status=AppointmentStatus.active
    )
    session.add(new_appointment)
    session.commit()
    session.refresh(new_appointment)
    
    return new_appointment

@app.get("/appointments/my", response_model=List[AppointmentRead])
async def get_my_appointments(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """List user's appointments based on their role"""
    if current_user.role == UserRole.doctor:
        appointments = session.exec(
            select(Appointment).where(Appointment.doctor_id == current_user.id)
        ).all()
    else:
        appointments = session.exec(
            select(Appointment).where(Appointment.patient_id == current_user.id)
        ).all()
    return appointments
