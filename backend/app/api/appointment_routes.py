from datetime import timedelta
from typing import List

import redis
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.auth import get_current_user
from app.database import get_session
from app.models import (
    Appointment,
    AppointmentCreate,
    AppointmentRead,
    AppointmentStatus,
    User,
    UserRole,
)

router = APIRouter(prefix="/appointments", tags=["appointments"])

redis_client = redis.Redis(host="appointment_redis", port=6379, db=0, decode_responses=True)


@router.post("", response_model=AppointmentRead, status_code=status.HTTP_201_CREATED)
async def create_appointment(
    appointment_data: AppointmentCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """
    Create appointment (Only users with patient role)
    Checks for double booking and doctor availability
    """
    if current_user.role != UserRole.patient:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can create appointments",
        )

    lock_key = f"lock:appointment:{appointment_data.doctor_id}:{appointment_data.start_time}"
    is_locked = redis_client.set(lock_key, "locked", ex=10, nx=True)
    if not is_locked:
        raise HTTPException(
            status_code=409,
            detail="This time slot is currently being processed by another user. Please try again.",
        )

    doctor = session.get(User, appointment_data.doctor_id)
    if not doctor or doctor.role != UserRole.doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found",
        )

    appointment_end_time = appointment_data.start_time + timedelta(hours=1)
    conflicting_appointment = session.exec(
        select(Appointment).where(
            Appointment.doctor_id == appointment_data.doctor_id,
            Appointment.status == AppointmentStatus.active,
            Appointment.start_time < appointment_end_time,
            Appointment.start_time >= appointment_data.start_time - timedelta(hours=1),
        )
    ).first()
    if conflicting_appointment:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This doctor has another appointment at the selected time",
        )

    new_appointment = Appointment(
        doctor_id=appointment_data.doctor_id,
        patient_id=current_user.id,
        start_time=appointment_data.start_time,
        status=AppointmentStatus.active,
    )
    session.add(new_appointment)
    session.commit()
    session.refresh(new_appointment)

    return new_appointment


@router.get("/my", response_model=List[AppointmentRead])
async def get_my_appointments(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """List user's appointments based on their role."""
    if current_user.role == UserRole.doctor:
        return session.exec(
            select(Appointment).where(Appointment.doctor_id == current_user.id)
        ).all()

    return session.exec(
        select(Appointment).where(Appointment.patient_id == current_user.id)
    ).all()

