
from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.auth import get_current_user
from app.database import get_session
from app.models import User, UserRead, UserRole

router = APIRouter(prefix="/patients", tags=["patients"])


@router.get("/waiting-list", response_model=list[UserRead])
async def get_waiting_list(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get list of all patients for waiting list."""
    return session.exec(
        select(User).where(User.role == UserRole.patient)
    ).all()


@router.get("/priority", response_model=list[UserRead])
async def get_priority_patients(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get priority patients (those with urgent conditions)."""
    # For now, return patients with specific medical histories
    urgent_conditions = ["Chest Pain", "Severe Headache", "Fever"]
    patients = session.exec(select(User).where(User.role == UserRole.patient)).all()

    priority_patients = [
        p for p in patients
        if p.medical_history and any(cond in p.medical_history for cond in urgent_conditions)
    ]

    return priority_patients
