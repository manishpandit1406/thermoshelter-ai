from pydantic import BaseModel
from typing import Optional, Dict, Any

class ClimateProfileBase(BaseModel):
    location_id: str
    classification: str
    source: str
    environmental_data: Dict[str, Any]

class ClimateProfileCreate(ClimateProfileBase):
    pass

class ClimateProfile(ClimateProfileBase):
    id: str

    class Config:
        from_attributes = True
