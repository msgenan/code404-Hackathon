from fastapi import FastAPI, Request, Depends, HTTPException, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
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
    title="Hastane Randevu Sistemi API",
    description="Hackathon Proje - Case 3: Hastane Randevu Yönetimi",
    version="1.0.0",
)

# CORS middleware ekle
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Production'da değiştirilmeli
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Prometheus metrics
Instrumentator().instrument(app).expose(app)

# Initialize Redis Connection
redis_client = redis.Redis(host='appointment_redis', port=6379, db=0, decode_responses=True)

# JSON formatında hata döndür (HTML değil)
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
    return JSONResponse(
        status_code=422,
        content={
            "error": "Validation Error",
            "details": exc.errors(),
            "body": exc.body,
        },
    )


@app.on_event("startup")
def on_startup():
    """Uygulama başlangıcında çalışır - Veritabanı tablolarını oluşturur ve seed data ekler"""
    from app.database import engine
    create_db_and_tables()
    
    # Seed data ekle
    with Session(engine) as session:
        # Varolan kullanıcıları kontrol et
        existing_users = session.exec(select(User)).all()
        
        if not existing_users:
            # 1 Doktor ekle
            doctor = User(
                email="doktor@hospital.com",
                password_hash=hash_password("doktor123"),
                role=UserRole.doctor,
                full_name="Dr. Ahmet Yılmaz"
            )
            session.add(doctor)
            
            # 1 Hasta ekle
            patient = User(
                email="hasta@hospital.com",
                password_hash=hash_password("hasta123"),
                role=UserRole.patient,
                full_name="Mehmet Demir"
            )
            session.add(patient)
            
            session.commit()
            print("✅ Seed data eklendi: 1 Doktor, 1 Hasta")


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "message": "Hastane Randevu Sistemi çalışıyor"}


# ============= AUTH ENDPOINTS =============

@app.post("/auth/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, session: Session = Depends(get_session)):
    """Yeni hasta kaydı oluştur (Sadece patient rolü)"""
    try:
        # Email kontrolü
        existing_user = session.exec(select(User).where(User.email == user_data.email)).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Bu email zaten kayıtlı"
            )
        
        # Yeni kullanıcı oluştur (Rolü zorla patient)
        new_user = User(
            email=user_data.email,
            password_hash=hash_password(user_data.password),
            role=UserRole.patient,  # Kayıt olurken sadece hasta rolü
            full_name=user_data.full_name
        )
        
        session.add(new_user)
        session.commit()
        session.refresh(new_user)
        
        return new_user
    
    except HTTPException:
        # HTTPException'ları olduğu gibi fırlat
        raise
    except ValueError as e:
        # Pydantic validation hatası
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        # Beklenmeyen hatalar
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Kayıt sırasında bir hata oluştu: {str(e)}"
        )


@app.post("/auth/login", response_model=Token)
async def login(login_data: UserLogin, session: Session = Depends(get_session)):
    """Kullanıcı girişi - JWT token döner"""
    user = authenticate_user(login_data.email, login_data.password, session)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email veya şifre hatalı",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # JWT token oluştur
    access_token = create_access_token(data={"sub": user.id})
    
    return Token(access_token=access_token)


# ============= APPOINTMENT ENDPOINTS =============

@app.get("/doctors", response_model=List[UserRead])
async def get_doctors(session: Session = Depends(get_session)):
    """Sadece doktor rolündeki kullanıcıları listele"""
    doctors = session.exec(select(User).where(User.role == UserRole.doctor)).all()
    return doctors


@app.post("/appointments", response_model=AppointmentRead, status_code=status.HTTP_201_CREATED)
async def create_appointment(
    appointment_data: AppointmentCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Randevu oluştur (Sadece patient rolündeki kullanıcılar)
    Çifte rezervasyon kontrolü yapar
    """
    # Sadece hastalar randevu alabilir
    if current_user.role != UserRole.patient:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sadece hastalar randevu alabilir"
        )
    
    # Create a unique lock key based on doctor and time
    lock_key = f"lock:appointment:{appointment_data.doctor_id}:{appointment_data.start_time}"
    
    # Try to acquire the lock for 10 seconds (nx=True means set only if not exists)
    is_locked = redis_client.set(lock_key, "locked", ex=10, nx=True)
    
    if not is_locked:
        raise HTTPException(status_code=409, detail="This time slot is currently being processed by another user. Please try again.")
    
    # Doktor kontrolü
    doctor = session.get(User, appointment_data.doctor_id)
    if not doctor or doctor.role != UserRole.doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doktor bulunamadı"
        )
    
    # Çifte rezervasyon kontrolü (Aynı doktor, aynı saat)
    # 1 saatlik randevu aralığı varsayımı
    appointment_end_time = appointment_data.start_time + timedelta(hours=1)
    
    # Aynı doktora aynı zaman aralığında başka randevu var mı?
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
            detail="Bu doktorun seçilen saatte başka randevusu var"
        )
    
    # Randevu oluştur
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
    """Kullanıcının randevularını listele"""
    if current_user.role == UserRole.doctor:
        # Doktor ise, kendisine ait randevuları göster
        appointments = session.exec(
            select(Appointment).where(Appointment.doctor_id == current_user.id)
        ).all()
    else:
        # Hasta ise, kendi randevularını göster
        appointments = session.exec(
            select(Appointment).where(Appointment.patient_id == current_user.id)
        ).all()
    
    return appointments
