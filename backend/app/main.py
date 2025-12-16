from fastapi import FastAPI

app = FastAPI(
    title="Smart Appointment System API",
    description="Hackathon project for Case 3: Smart Appointment and Queue Management",
    version="0.1.0",
)


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok"}
