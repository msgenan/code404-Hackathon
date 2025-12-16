# main.py

from fastapi import FastAPI, Request, Depends
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from sqlalchemy.orm import Session
from app.database import Base, engine, get_db
from app.schemas.user_class import UserCreate, User
from app.crud import create_user
from app.models import User as DBUser # Renamed to avoid confusion with the schema

# --- Database Initialization (Runs on startup) ---
# Create all tables defined in models.py if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Smart Appointment System API",
    description="Hackathon project for Case 3: Smart Appointment and Queue Management",
    version="0.1.0",
)

# ... (Your exception handlers remain the same) ...
# You should also add the CORS middleware here if you haven't already!

# ------------------------
# Exception handlers for JSON responses (omitted for brevity)
# ------------------------

# ------------------------
# Routes
# ------------------------

@app.get("/")
async def read_root():
    return {"message": "Welcome to the Smart Appointment System API"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.post("/users", response_model=User) # <-- Response model is now the full User schema
async def handle_create_user(
    user: UserCreate, 
    db: Session = Depends(get_db) # <-- Dependency injection for DB session
):
    # 1. Data validation already happened via Pydantic (UserCreate)
    
    # 2. Use the CRUD function to save the user to the database
    db_user = create_user(db=db, user=user)
    
    # 3. Return the saved user object
    return db_user