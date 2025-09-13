"""Main FastAPI application for TapeRX Healthcare Platform."""
import os
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from auth.auth_service import get_current_user, User, app as auth_app
from db.models import Base, Patient

# Database setup
DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./taperx.db")
engine = create_engine(
    DATABASE_URL,
    connect_args={
        "check_same_thread": False
    } if "sqlite" in DATABASE_URL else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
Base.metadata.create_all(bind=engine)

# FastAPI app
app = FastAPI(
    title="TapeRX Healthcare Platform API",
    description="AI-Enhanced Medication Tapering Platform",
    version="1.0.0"
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", "http://localhost:8080", "*"
    ],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Pydantic models for API
class PatientCreate(BaseModel):
    name: str
    phone: str


class PatientResponse(BaseModel):
    id: int
    name: str
    phone: str

    class Config:
        from_attributes = True


class TaperingScheduleItem(BaseModel):
    date: str
    dose: float
    notes: Optional[str] = None


class SymptomAssessment(BaseModel):
    question_id: int
    answer: bool


class SymptomSubmission(BaseModel):
    answers: List[SymptomAssessment]


class DashboardMetrics(BaseModel):
    recovery_score: int
    withdrawal_strain: float
    sleep_quality: int
    ai_risk_score: int
    current_dose: float
    next_dose: float
    next_reduction_date: str


# Include auth routes
app.mount("/auth", auth_app)


# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "taperx-api"}


# Authentication-required routes
@app.get("/api/user/profile", response_model=User)
async def get_user_profile(current_user: User = Depends(get_current_user)):
    """Get current user profile."""
    return current_user


@app.get("/api/patients", response_model=List[PatientResponse])
async def get_patients(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all patients for current user (demo implementation)."""
    patients = db.query(Patient).all()
    return patients


@app.post("/api/patients", response_model=PatientResponse)
async def create_patient(
    patient: PatientCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new patient."""
    db_patient = Patient(name=patient.name, phone=patient.phone)
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient


@app.get("/api/schedule", response_model=List[TaperingScheduleItem])
async def get_tapering_schedule(
    current_user: User = Depends(get_current_user)
):
    """Get AI-optimized tapering schedule."""
    # Mock data for demo - in production this would come from ML services
    start_date = datetime.now()
    schedule = []

    # Hyperbolic tapering schedule (simplified)
    doses = [25, 22.5, 20, 17.5, 15, 12.5, 10, 7.5, 5, 2.5, 0]

    for i, dose in enumerate(doses):
        item_date = start_date + timedelta(weeks=i*2)
        schedule.append({
            "date": item_date.strftime("%Y-%m-%d"),
            "dose": dose,
            "notes": f"Hyperbolic reduction - Week {i*2}"
        })

    return schedule


@app.get("/api/dashboard", response_model=DashboardMetrics)
async def get_dashboard_metrics(
    current_user: User = Depends(get_current_user)
):
    """Get dashboard metrics and AI insights."""
    # Mock data for demo - in production this would integrate with ML services
    return DashboardMetrics(
        recovery_score=78,
        withdrawal_strain=14.2,
        sleep_quality=85,
        ai_risk_score=23,
        current_dose=25.0,
        next_dose=22.5,
        next_reduction_date=(
            datetime.now() + timedelta(days=14)
        ).strftime("%Y-%m-%d")
    )


@app.get("/api/symptoms")
async def get_symptoms(current_user: User = Depends(get_current_user)):
    """Get daily symptom assessment questions."""
    # Mock data for demo
    return [
        {
            "id": 1,
            "question": "Did you sleep well last night?",
            "category": "sleep",
            "answer": None
        },
        {
            "id": 2,
            "question": "Any withdrawal symptoms this morning?",
            "category": "physical",
            "answer": None
        },
        {
            "id": 3,
            "question": "Experienced dizziness today?",
            "category": "physical",
            "answer": None
        },
        {
            "id": 4,
            "question": "Mood felt stable today?",
            "category": "emotional",
            "answer": None
        },
        {
            "id": 5,
            "question": "Took medication as scheduled?",
            "category": "adherence",
            "answer": None
        }
    ]


@app.post("/api/symptoms")
async def submit_symptoms(
    submission: SymptomSubmission,
    current_user: User = Depends(get_current_user)
):
    """Submit daily symptom assessment."""
    # In production, this would store in database and trigger ML analysis
    return {"status": "success", "message": "Symptoms recorded successfully"}


# Routes for frontend compatibility
@app.post("/api/register")
async def register_user():
    """User registration endpoint (simplified for demo)."""
    return {"message": "Registration successful - use demo/demo to login"}


@app.post("/api/login")
async def login_user():
    """Login endpoint - redirects to auth service."""
    return {"message": "Use /auth/token endpoint for authentication"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
