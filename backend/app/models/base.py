from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime
from enum import Enum
from pydantic import EmailStr, validator


# Enum tanımlamaları
class UserRole(str, Enum):
    admin = "admin"
    doctor = "doctor"
    patient = "patient"


class AppointmentStatus(str, Enum):
    active = "active"
    cancelled = "cancelled"


# Database Models
class User(SQLModel, table=True):
    """Kullanıcı Tablosu"""
    __tablename__ = "users"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    password_hash: str
    role: UserRole = Field(default=UserRole.patient)
    full_name: str
    
    # İlişkiler
    appointments_as_doctor: List["Appointment"] = Relationship(
        back_populates="doctor",
        sa_relationship_kwargs={"foreign_keys": "Appointment.doctor_id"}
    )
    appointments_as_patient: List["Appointment"] = Relationship(
        back_populates="patient",
        sa_relationship_kwargs={"foreign_keys": "Appointment.patient_id"}
    )


class Appointment(SQLModel, table=True):
    """Randevu Tablosu"""
    __tablename__ = "appointments"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    doctor_id: int = Field(foreign_key="users.id")
    patient_id: int = Field(foreign_key="users.id")
    start_time: datetime
    status: AppointmentStatus = Field(default=AppointmentStatus.active)
    
    # İlişkiler
    doctor: Optional[User] = Relationship(
        back_populates="appointments_as_doctor",
        sa_relationship_kwargs={"foreign_keys": "[Appointment.doctor_id]"}
    )
    patient: Optional[User] = Relationship(
        back_populates="appointments_as_patient",
        sa_relationship_kwargs={"foreign_keys": "[Appointment.patient_id]"}
    )


# Pydantic Schemas (Validation)
class UserBase(SQLModel):
    email: EmailStr
    full_name: str


class UserCreate(UserBase):
    """Kullanıcı kayıt şeması"""
    password: str
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Şifre en az 8 karakter olmalıdır')
        
        if not any(char.isupper() for char in v):
            raise ValueError('Şifre en az 1 büyük harf içermelidir')
        
        if not any(char.islower() for char in v):
            raise ValueError('Şifre en az 1 küçük harf içermelidir')
        
        if not any(char.isdigit() for char in v):
            raise ValueError('Şifre en az 1 rakam içermelidir')
        
        # Özel karakter kontrolü
        special_chars = "!@#$%^&*(),.?\":{}|<>"
        if not any(char in special_chars for char in v):
            raise ValueError('Şifre en az 1 özel karakter içermelidir (!@#$%^&* vb.)')
        
        return v
    
    @validator('full_name')
    def validate_full_name(cls, v):
        v = v.strip()
        if len(v) < 2:
            raise ValueError('İsim en az 2 karakter olmalıdır')
        
        if len(v) > 100:
            raise ValueError('İsim çok uzun (maksimum 100 karakter)')
        
        # Sadece harf, boşluk ve Türkçe karakterler
        import re
        if not re.match(r'^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$', v):
            raise ValueError('İsim sadece harf içermelidir')
        
        return v
    
    @validator('email')
    def validate_email(cls, v):
        # EmailStr zaten format kontrolü yapıyor, ekstra kontroller
        if len(v) > 255:
            raise ValueError('Email adresi çok uzun')
        return v.lower().strip()


class UserLogin(SQLModel):
    """Kullanıcı giriş şeması"""
    email: EmailStr
    password: str


class UserRead(UserBase):
    """Kullanıcı okuma şeması"""
    id: int
    role: UserRole


class AppointmentCreate(SQLModel):
    """Randevu oluşturma şeması"""
    doctor_id: int
    start_time: datetime
    
    @validator('start_time')
    def validate_start_time(cls, v):
        if v < datetime.now():
            raise ValueError('Randevu zamanı geçmişte olamaz')
        return v


class AppointmentRead(SQLModel):
    """Randevu okuma şeması"""
    id: int
    doctor_id: int
    patient_id: int
    start_time: datetime
    status: AppointmentStatus
    doctor: Optional[UserRead] = None
    patient: Optional[UserRead] = None


class Token(SQLModel):
    """JWT Token şeması"""
    access_token: str
    token_type: str = "bearer"
