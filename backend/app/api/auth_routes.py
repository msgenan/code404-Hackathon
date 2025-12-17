from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.auth import authenticate_user, create_access_token, hash_password, get_current_user
from app.database import get_session
from app.models import Token, User, UserCreate, UserLogin, UserRead, UserRole

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, session: Session = Depends(get_session)):
    """User registration endpoint."""
    try:
        existing_user = session.exec(select(User).where(User.email == user_data.email)).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This email is already registered",
            )
        new_user = User(
            email=user_data.email,
            password_hash=hash_password(user_data.password),
            role=UserRole.patient,
            full_name=user_data.full_name,
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
            detail=str(e),
        ) from e
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during registration: {str(e)}",
        ) from e


@router.post("/login", response_model=Token)
async def login(login_data: UserLogin, session: Session = Depends(get_session)):
    """User login - returns JWT token."""
    user = authenticate_user(login_data.email, login_data.password, session)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email veya şifre hatalı",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": str(user.id)})

    return Token(access_token=access_token)


@router.get("/me", response_model=UserRead)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current authenticated user."""
    return current_user

