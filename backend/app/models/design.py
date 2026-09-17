import uuid
from sqlalchemy import Column, String, Float, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.database.connection import Base


class DesignParameters(Base):
    __tablename__ = "design_parameters"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, unique=True)
    shelter_type = Column(String(50), default="residential")
    wall_material = Column(String(50), default="rammed_earth")
    roof_material = Column(String(50), default="metal_sheet")
    roof_type = Column(String(50), default="flat")
    glazing_type = Column(String(50), default="double_glass")
    width = Column(Float, default=8.0)
    length = Column(Float, default=12.0)
    height = Column(Float, default=3.0)
    orientation = Column(Float, default=0.0)       # degrees from South
    window_ratio = Column(Float, default=15.0)     # %
    insulation_mm = Column(Float, default=50.0)
    # Overrides for physics engine
    thermal_mass_override = Column(Float, nullable=True) # J/K
    u_value_override = Column(Float, nullable=True)      # W/m2K
    solar_absorptance = Column(Float, default=0.7)       # 0.0-1.0

    project = relationship("Project", back_populates="design")
