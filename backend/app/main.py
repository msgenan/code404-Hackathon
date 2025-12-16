from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator
from starlette.exceptions import HTTPException as StarletteHTTPException
from sqlmodel import Session, select

from app.database import create_db_and_tables, get_session
from app.models import User, UserRole
from app.auth import hash_password
from app.api.auth_routes import router as auth_router
from app.api.doctor_routes import router as doctor_router
from app.api.appointment_routes import router as appointment_router
from app.api.health_routes import router as health_router

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

