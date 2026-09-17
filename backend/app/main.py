import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

logger = logging.getLogger("thermoshelter")

app = FastAPI(
    title="ThermoShelter AI API",
    description="Backend API for the ThermoShelter AI application",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, update in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    from app.database.connection import engine, Base
    from app.models.project import Project
    from app.models.climate import ClimateProfile
    from app.models.design import DesignParameters
    from app.models.location import Location
    from app.models.optimization import OptimizationResult
    from app.models.simulation import SimulationResult
    Base.metadata.create_all(bind=engine)
    logger.info("Database connected and tables created.")
except Exception as e:
    logger.warning(
        f"Database not available: {e}\n"
        "Set DATABASE_URL env var with correct credentials to enable persistence.\n"
        "Running in degraded mode (API available, no DB persistence)."
    )

from app.api.v1.projects import router as projects_router
from app.api.v1.climate import router as climate_router
from app.api.v1.simulations import router as simulations_router
from app.api.v1.design import router as design_router

app.include_router(projects_router, prefix="/api/v1")
app.include_router(climate_router, prefix="/api/v1")
app.include_router(simulations_router, prefix="/api/v1")
app.include_router(design_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"status": "ok", "message": "ThermoShelter AI API is running"}

@app.get("/health")
def health_check():
    from app.database.connection import engine
    try:
        with engine.connect() as conn:
            return {"status": "ok", "db": "connected"}
    except Exception as e:
        return {"status": "ok", "db": "unavailable", "error": str(e)}
