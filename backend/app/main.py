from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from prometheus_fastapi_instrumentator import Instrumentator
from starlette.exceptions import HTTPException as StarletteHTTPException

app = FastAPI(
    title="Smart Appointment System API",
    description="Hackathon project for Case 3: Smart Appointment and Queue Management",
    version="0.1.0",
)

# Initialize Prometheus metrics
Instrumentator().instrument(app).expose(app)


# JSON formatında hata döndür (HTML değil)
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "status_code": exc.status_code,
            "path": str(request.url.path),
        },
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "error": "Validation Error",
            "details": exc.errors(),
            "body": exc.body,
        },
    )


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok"}
