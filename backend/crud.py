# backend/app/crud.py

from sqlalchemy.orm import Session
from app.models import User
from app.schemas.user_class import UserCreate

def create_user(db: Session, user: UserCreate):
    # 1. Create the SQLAlchemy model instance from the Pydantic data
    # Note: user.personal_id is used because Pydantic handles the alias 'id' -> 'personal_id'
    db_user = User(
        personal_id=user.personal_id,
        name=user.name,
        surname=user.surname,
        email=user.email,
        phone=user.phone
    )
    
    # 2. Add, commit, and refresh to save data and retrieve the new DB ID
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user