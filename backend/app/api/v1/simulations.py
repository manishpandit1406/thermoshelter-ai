from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.design import DesignParameters
from app.models.location import Location
from app.services.physics_engine import simulate_shelter

router = APIRouter(prefix="/projects", tags=["simulations"])

@router.get("/{project_id}/simulation")
def get_simulation(project_id: str, db: Session = Depends(get_db)):
    design = db.query(DesignParameters).filter(DesignParameters.project_id == project_id).first()
    location = db.query(Location).filter(Location.project_id == project_id).first()
    
    loc_params = {}
    if location:
        loc_params = {
            "lat": location.latitude,
            "lng": location.longitude
        }
        
    design_params = {}
    if design:
        design_params = {
            "wall_material": design.wall_material,
            "roof_material": design.roof_material,
            "glazing_type": design.glazing_type,
            "width": design.width,
            "length": design.length,
            "height": design.height,
            "window_ratio": design.window_ratio,
            "thermal_mass_override": design.thermal_mass_override,
            "u_value_override": design.u_value_override
        }
    elif location:
        from app.services.ai_optimizer import predict_optimal_design
        ai_design = predict_optimal_design(location.latitude, location.longitude)
        design_params = {
            "wall_material": ai_design["wallMaterial"],
            "roof_material": ai_design["roofMaterial"],
            "glazing_type": ai_design["glazingType"],
            "width": ai_design["width"],
            "length": ai_design["length"],
            "height": ai_design["height"],
            "window_ratio": ai_design["windowRatio"],
            "thermal_mass_override": ai_design["thermalMassOverride"],
            "u_value_override": None
        }
        
    result = simulate_shelter(design_params, loc_params)
    
    # Return both the detailed 24h data and the overall metrics
    return {
        "hourly_data": result["hourly_data"],
        "metrics": result["metrics"],
        "design": {
            "width": design_params.get("width", 8),
            "length": design_params.get("length", 12),
            "height": design_params.get("height", 3),
            "roofType": design.roof_type if design else (ai_design["roofType"] if not design and location else "flat")
        }
    }
