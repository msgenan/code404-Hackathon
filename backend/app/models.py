from datetime import datetime, timezone
from enum import Enum
from typing import List, Optional

from pydantic import EmailStr, validator
from sqlmodel import Field, Relationship, SQLModel


# Enum definitions
class UserRole(str, Enum):
    admin = "admin"
    doctor = "doctor"
    patient = "patient"


class AppointmentStatus(str, Enum):
    active = "active"
    cancelled = "cancelled"


# Database models
class User(SQLModel, table=True):
    """User table."""

    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    password_hash: str
    role: UserRole = Field(default=UserRole.patient)
    full_name: str
    phone: Optional[str] = Field(default=None)
    age: Optional[int] = Field(default=None)
    gender: Optional[str] = Field(default=None)
    department: Optional[str] = Field(default=None)  # For doctors
    medical_history: Optional[str] = Field(default=None)  # For patients
    allergies: Optional[str] = Field(default=None)  # For patients

    appointments_as_doctor: List["Appointment"] = Relationship(
        back_populates="doctor",
        sa_relationship_kwargs={"foreign_keys": "Appointment.doctor_id"},
    )
    appointments_as_patient: List["Appointment"] = Relationship(
        back_populates="patient",
        sa_relationship_kwargs={"foreign_keys": "Appointment.patient_id"},
    )


class Appointment(SQLModel, table=True):
    """Appointment table."""

    __tablename__ = "appointments"

    id: Optional[int] = Field(default=None, primary_key=True)
    doctor_id: int = Field(foreign_key="users.id")
    patient_id: int = Field(foreign_key="users.id")
    start_time: datetime
    status: AppointmentStatus = Field(default=AppointmentStatus.active)
    appointment_type: Optional[str] = Field(default="Consultation")
    notes: Optional[str] = Field(default=None)

    doctor: Optional[User] = Relationship(
        back_populates="appointments_as_doctor",
        sa_relationship_kwargs={"foreign_keys": "[Appointment.doctor_id]"},
    )
    patient: Optional[User] = Relationship(
        back_populates="appointments_as_patient",
        sa_relationship_kwargs={"foreign_keys": "[Appointment.patient_id]"},
    )


# Pydantic schemas
class UserBase(SQLModel):
    email: EmailStr
    full_name: str


class UserCreate(UserBase):
    """User registration schema."""

    password: str

    @validator("password")
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError("Şifre en az 8 karakter olmalıdır")

        if not any(char.isupper() for char in v):
            raise ValueError("Şifre en az 1 büyük harf içermelidir")

        if not any(char.islower() for char in v):
            raise ValueError("Şifre en az 1 küçük harf içermelidir")

        if not any(char.isdigit() for char in v):
            raise ValueError("Şifre en az 1 rakam içermelidir")

        special_chars = "!@#$%^&*(),.?\":{}|<>"
        if not any(char in special_chars for char in v):
            raise ValueError("Şifre en az 1 özel karakter içermelidir (!@#$%^&* vb.)")

        return v

    @validator("full_name")
    def validate_full_name(cls, v):
        v = v.strip()
        if len(v) < 2:
            raise ValueError("İsim en az 2 karakter olmalıdır")

        if len(v) > 100:
            raise ValueError("İsim çok uzun (maksimum 100 karakter)")

        import re

        if not re.match(r"^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$", v):
            raise ValueError("İsim sadece harf içermelidir")

        return v

    @validator("email")
    def validate_email(cls, v):
        if len(v) > 255:
            raise ValueError("Email adresi çok uzun")
        return v.lower().strip()


class UserLogin(SQLModel):
    """User login schema."""

    email: EmailStr
    password: str


class UserRead(UserBase):
    """User read schema."""

    id: int
    role: UserRole
    phone: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    department: Optional[str] = None
    medical_history: Optional[str] = None
    allergies: Optional[str] = None


class AppointmentCreate(SQLModel):
    """Appointment creation schema."""

    doctor_id: int
    start_time: datetime

    @validator("start_time")
    def validate_start_time(cls, v):
        # Make both datetimes timezone-aware for comparison
        now = datetime.now(timezone.utc)
        appointment_time = v if v.tzinfo is not None else v.replace(tzinfo=timezone.utc)
        if appointment_time < now:
            raise ValueError("Appointment time cannot be in the past")
        return v


class AppointmentRead(SQLModel):
    """Appointment read schema."""

    id: int
    doctor_id: int
    patient_id: int
    start_time: datetime
    status: AppointmentStatus
    appointment_type: Optional[str] = None
    notes: Optional[str] = None
    doctor: Optional[UserRead] = None
    patient: Optional[UserRead] = None


class Token(SQLModel):
    """JWT token schema."""

    access_token: str
    token_type: str = "bearer"

