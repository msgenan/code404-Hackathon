
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlmodel import Session

from app.auth import get_current_user
from app.database import get_session
from app.models import User, UserRead

router = APIRouter(prefix="/users", tags=["users"])


class UserProfileUpdate(BaseModel):
    """Schema for updating user profile."""
    full_name: str | None = None
    phone: str | None = None
    age: int | None = None
    gender: str | None = None
    medical_history: str | None = None
    allergies: str | None = None


@router.put("/profile", response_model=UserRead)
async def update_profile(
    profile_data: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """
    Update current user's profile information
    """
    # Update only provided fields
    if profile_data.full_name is not None:
        current_user.full_name = profile_data.full_name
    if profile_data.phone is not None:
        current_user.phone = profile_data.phone
    if profile_data.age is not None:
        current_user.age = profile_data.age
    if profile_data.gender is not None:
        current_user.gender = profile_data.gender
    if profile_data.medical_history is not None:
        current_user.medical_history = profile_data.medical_history
    if profile_data.allergies is not None:
        current_user.allergies = profile_data.allergies

    session.add(current_user)
    session.commit()
    session.refresh(current_user)

    return current_user


@router.get("/profile-completion", response_model=dict)
async def check_profile_completion(
    current_user: User = Depends(get_current_user),
):
    """
    Check if user profile is complete
    Returns completion percentage and missing fields
    """
    required_fields = {
        "full_name": current_user.full_name,
        "phone": current_user.phone,
        "age": current_user.age,
        "gender": current_user.gender,
    }

    # For patients, also check medical info
    if current_user.role.value == "patient":
        required_fields["medical_history"] = current_user.medical_history
        required_fields["allergies"] = current_user.allergies

    missing_fields = [field for field, value in required_fields.items() if not value]
    total_fields = len(required_fields)
    completed_fields = total_fields - len(missing_fields)
    completion_percentage = int((completed_fields / total_fields) * 100)

    return {
        "is_complete": len(missing_fields) == 0,
        "completion_percentage": completion_percentage,
        "missing_fields": missing_fields,
        "total_fields": total_fields,
        "completed_fields": completed_fields,
    }
