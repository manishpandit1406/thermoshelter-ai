import uuid
from sqlalchemy import Column, String, Float, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.database.connection import Base


class DesignParameters(Base):
    __tablename__ = "design_parameters"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, unique=True)
    shelter_type = Column(String(50), default="residential")
    material = Column(String(50), default="concrete")
    roof_type = Column(String(50), default="flat")
    width = Column(Float, default=8.0)
    length = Column(Float, default=12.0)
    height = Column(Float, default=3.0)
    orientation = Column(Float, default=0.0)       # degrees from South
    window_ratio = Column(Float, default=15.0)     # %
    insulation_mm = Column(Float, default=50.0)
    insulation_r_value = Column(Float, nullable=True)  # computed

    project = relationship("Project", back_populates="design")
