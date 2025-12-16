# code404-Hackathon/backend/app/database.py

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# --- Configuration ---
POSTGRES_USER = os.environ.get("POSTGRES_USER", "postgres")
POSTGRES_PASSWORD = os.environ.get("POSTGRES_PASSWORD", "postgres")
POSTGRES_DB = os.environ.get("POSTGRES_DB", "appointment_db")
POSTGRES_PORT = os.environ.get("POSTGRES_PORT", "5432")

SQLALCHEMY_DATABASE_URL = (
    f"postgresql+psycopg2://{POSTGRES_USER}:{POSTGRES_PASSWORD}@db:{POSTES_PORT}/{POSTGRES_DB}"
)
# ...

# --- SQLAlchemy Setup ---
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# This is the actual DB session we will use
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for our SQLAlchemy models
Base = declarative_base()

# --- Dependency to get a session (for FastAPI routes) ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()