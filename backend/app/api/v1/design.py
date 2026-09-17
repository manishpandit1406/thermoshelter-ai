from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.design import DesignParameters
from app.models.project import Project

router = APIRouter(prefix="/projects", tags=["design"])

@router.get("/{project_id}/design")
def get_design(project_id: str, db: Session = Depends(get_db)):
    design = db.query(DesignParameters).filter(DesignParameters.project_id == project_id).first()
    if not design:
        return {} # Return empty so frontend uses defaults
    
    return {
        "shelterType": design.shelter_type,
        "wallMaterial": design.wall_material,
        "roofMaterial": design.roof_material,
        "roofType": design.roof_type,
        "glazingType": design.glazing_type,
        "width": design.width,
        "length": design.length,
        "height": design.height,
        "orientation": design.orientation,
        "windowRatio": design.window_ratio,
        "thermalMassOverride": design.thermal_mass_override,
        "insulationMm": design.insulation_mm
    }

@router.put("/{project_id}/design")
def update_design(project_id: str, data: dict, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        project = Project(id=project_id, name="Recovered Project")
        db.add(project)
        db.commit()

    design = db.query(DesignParameters).filter(DesignParameters.project_id == project_id).first()
    if not design:
        design = DesignParameters(project_id=project_id)
        db.add(design)
        
    design.shelter_type = data.get("shelterType", design.shelter_type)
    design.wall_material = data.get("wallMaterial", design.wall_material)
    design.roof_material = data.get("roofMaterial", design.roof_material)
    design.roof_type = data.get("roofType", design.roof_type)
    design.glazing_type = data.get("glazingType", design.glazing_type)
    design.width = float(data.get("width", design.width))
    design.length = float(data.get("length", design.length))
    design.height = float(data.get("height", design.height))
    design.orientation = float(data.get("orientation", design.orientation))
    design.window_ratio = float(data.get("windowRatio", design.window_ratio))
    design.thermal_mass_override = float(data.get("thermalMassOverride")) if data.get("thermalMassOverride") else 0
    design.insulation_mm = float(data.get("insulationMm", design.insulation_mm))

    db.commit()
    return {"message": "Design parameters saved successfully"}

from app.services.ai_optimizer import predict_optimal_design
from app.models.location import Location

from pydantic import BaseModel
from typing import Optional

class AIPredictRequest(BaseModel):
    prompt: Optional[str] = None

@router.post("/{project_id}/ai-predict")
def ai_predict_design(project_id: str, req: AIPredictRequest, db: Session = Depends(get_db)):
    location = db.query(Location).filter(Location.project_id == project_id).first()
    if not location or not location.latitude or not location.longitude:
        raise HTTPException(status_code=400, detail="Location not set for this project")
        
    optimal_design, description = predict_optimal_design(location.latitude, location.longitude, req.prompt)
    return {"design": optimal_design, "description": description}
