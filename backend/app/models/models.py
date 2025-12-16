# backend/app/models.py

from sqlalchemy import Column, Integer, String
# NOTE: The import path assumes app/models.py. If you use app/models/models.py,
# you must adjust the import in app/main.py to "from app.models.models import User as DBUser"
from app.database import Base

class User(Base):
    __tablename__ = "users"

    # Primary Key - auto-incrementing ID
    id = Column(Integer, primary_key=True, index=True)

    # Columns corresponding to your Pydantic schema
    personal_id = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    surname = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, unique=True, nullable=False)

    def __repr__(self):
        return f"<User(personal_id='{self.personal_id}', name='{self.name}')>"