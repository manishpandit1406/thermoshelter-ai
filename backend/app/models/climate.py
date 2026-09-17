import uuid
from sqlalchemy import Column, String, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database.connection import Base


class ClimateProfile(Base):
    __tablename__ = "climate_profiles"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    location_id = Column(String(36), ForeignKey("locations.id", ondelete="CASCADE"), nullable=False, unique=True)
    classification = Column(String(100), nullable=False)   # e.g. "BWh - Hot Desert"
    source = Column(String(100), default="computed")
    environmental_data = Column(JSON, default=dict)        # general climate info
    monthly_temps = Column(JSON, default=list)             # list of {month, avg_temp_c, solar_kwh_m2}

    location = relationship("Location", back_populates="climate")
