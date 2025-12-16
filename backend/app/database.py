import os
from sqlmodel import SQLModel, create_engine, Session
from typing import Generator

# Çevresel değişkenlerden veritabanı bilgilerini al
DB_USER = os.getenv("POSTGRES_USER", "postgres")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "postgres")
DB_HOST = os.getenv("POSTGRES_HOST", "localhost")
DB_PORT = os.getenv("POSTGRES_PORT", "5432")
DB_NAME = os.getenv("POSTGRES_DB", "hospital_db")

# DATABASE_URL oluştur
DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# SQLModel engine oluştur
engine = create_engine(DATABASE_URL, echo=True)


def create_db_and_tables():
    """Veritabanı tablolarını oluştur"""
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """Veritabanı session dependency"""
    with Session(engine) as session:
        yield session
