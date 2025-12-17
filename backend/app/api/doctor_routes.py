
from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.database import get_session
from app.models import User, UserRead, UserRole

router = APIRouter(prefix="/doctors", tags=["doctors"])


@router.get("", response_model=list[UserRead])
async def get_doctors(session: Session = Depends(get_session)):
    """List only users with doctor role."""
    return session.exec(select(User).where(User.role == UserRole.doctor)).all()

