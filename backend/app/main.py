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
            "detail": " | ".join(error_messages)
            if error_messages
            else "Validation error"
        },
    )


@app.on_event("startup")
def on_startup():
    """Runs at application startup - creates database tables and adds seed data"""
    from app.database import engine

    create_db_and_tables()
    with Session(engine) as session:
        # Check if doctor already exists to avoid duplicate key error
        existing_doctor = session.exec(
            select(User).where(User.email == "doCtor@hospital.com")
        ).first()
        existing_patient = session.exec(
            select(User).where(User.email == "patient@hospital.com")
        ).first()

        if not existing_doctor:
            doctor = User(
                email="doCtor@hospital.com",
                password_hash=hash_password("doCtor123"),
                role=UserRole.doctor,
                full_name="Dr. Ahmet Yilmaz",
            )
            session.add(doctor)
            print("✅ Added doctor seed data")
        
        if not existing_patient:
            patient = User(
                email="patient@hospital.com",
                password_hash=hash_password("patient123"),
                role=UserRole.patient,
                full_name="Mehmet Demir",
            )
            session.add(patient)
            print("✅ Added patient seed data")
        
        if not existing_doctor or not existing_patient:
            session.commit()
