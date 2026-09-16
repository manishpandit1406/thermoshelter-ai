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

# Try to initialize DB — server starts regardless of DB availability
try:
    from app.database.connection import engine, Base
    Base.metadata.create_all(bind=engine)
    logger.info("Database connected and tables created.")
except Exception as e:
    logger.warning(
        f"Database not available: {e}\n"
        "Set DATABASE_URL env var with correct credentials to enable persistence.\n"
        "Running in degraded mode (API available, no DB persistence)."
    )

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
