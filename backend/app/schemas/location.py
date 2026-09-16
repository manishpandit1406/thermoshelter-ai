from pydantic import BaseModel
from typing import Optional

class LocationBase(BaseModel):
    name: str
    latitude: float
    longitude: float
    elevation: Optional[float] = None

class LocationCreate(LocationBase):
    project_id: str

class Location(LocationBase):
    id: str
    project_id: str

    class Config:
        from_attributes = True
