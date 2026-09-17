import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database.connection import Base


class SimulationResult(Base):
    __tablename__ = "simulation_results"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, unique=True)
    annual_heat_load = Column(Float, nullable=False)       # kWh
    annual_cooling_load = Column(Float, nullable=False)    # kWh
    peak_temp_inside = Column(Float, nullable=False)       # °C
    min_temp_inside = Column(Float, nullable=False)        # °C
    energy_efficiency_rating = Column(String(5), nullable=False)  # A+, A, B, C, D
    comfort_score = Column(Float, nullable=False)          # 0-100
    monthly_data = Column(JSON, default=list)              # [{m, out, in, heat, cool}, ...]
    ran_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="simulation")
