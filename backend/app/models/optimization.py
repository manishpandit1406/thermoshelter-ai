import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from app.database.connection import Base


class OptimizationResult(Base):
    __tablename__ = "optimization_results"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, unique=True)
    suggestions = Column(JSONB, default=[])          # list of suggestion dicts
    energy_savings_pct = Column(Float, default=0.0)  # total if all applied
    cost_savings_annual = Column(Float, default=0.0) # ₹ per year
    ran_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="optimization")
