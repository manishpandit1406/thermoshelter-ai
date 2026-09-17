import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Enum as PgEnum
from sqlalchemy.orm import relationship
from app.database.connection import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    description = Column(String(1000), nullable=True)
    status = Column(
        PgEnum("draft", "in_progress", "simulated", "optimized", "complete",
               name="project_status"),
        nullable=False, default="draft"
    )
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    location = relationship("Location", back_populates="project", uselist=False, cascade="all, delete-orphan")
    design = relationship("DesignParameters", back_populates="project", uselist=False, cascade="all, delete-orphan")
    simulation = relationship("SimulationResult", back_populates="project", uselist=False, cascade="all, delete-orphan")
    optimization = relationship("OptimizationResult", back_populates="project", uselist=False, cascade="all, delete-orphan")
