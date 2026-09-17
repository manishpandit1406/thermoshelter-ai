import requests
from typing import Dict, Any

def get_climate_summary(lat: float, lng: float) -> Dict[str, Any]:
    url = f"https://archive-api.open-meteo.com/v1/archive?latitude={lat}&longitude={lng}&start_date=2022-01-01&end_date=2022-12-31&daily=temperature_2m_max,temperature_2m_min&timezone=auto"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        t_max = data.get("daily", {}).get("temperature_2m_max", [])
        t_min = data.get("daily", {}).get("temperature_2m_min", [])
        
        valid_max = [t for t in t_max if t is not None]
        valid_min = [t for t in t_min if t is not None]
        
        avg_max = sum(valid_max) / len(valid_max) if valid_max else 20
        avg_min = sum(valid_min) / len(valid_min) if valid_min else 10
        overall_min = min(valid_min) if valid_min else 0
        overall_max = max(valid_max) if valid_max else 30
        
        return {
            "avg_max": avg_max,
            "avg_min": avg_min,
            "overall_min": overall_min,
            "overall_max": overall_max,
        }
    except Exception as e:
        print(f"Error fetching climate for AI: {e}")
        return {"avg_max": 25, "avg_min": 15, "overall_min": 10, "overall_max": 35}

def predict_optimal_design(lat: float, lng: float, prompt: str = "") -> tuple[Dict[str, Any], str]:
    """
    Simulates an AI making material and design choices based on geographic climate data and user prompt.
    """
    climate = get_climate_summary(lat, lng)
    
    # Heuristic rules engine based on building physics
    design = {
        "shelterType": "residential",
        "wallMaterial": "brick_wall",
        "roofType": "flat",
        "roofMaterial": "metal_sheet",
        "glazingType": "double_glass",
        "width": 8,
        "length": 12,
        "height": 3,
        "orientation": 0,
        "windowRatio": 15,
        "thermalMassOverride": 0,
        "insulationMm": 50,
    }
    
    description_parts = []
    description_parts.append(f"**Climate Analysis:** The location experiences an average max of {climate['avg_max']:.1f}°C and min of {climate['avg_min']:.1f}°C.")

    # Parse prompt for overrides
    p = prompt.lower() if prompt else ""
    
    if "wood" in p or "timber" in p:
        design["wallMaterial"] = "timber_frame"
        description_parts.append("You requested wood/timber, so we selected a **Timber Frame** construction, which is lightweight and sustainable.")
    elif "earth" in p or "mud" in p:
        design["wallMaterial"] = "rammed_earth"
        description_parts.append("You requested earth/mud, so **Rammed Earth** walls are selected for exceptional thermal mass.")
    elif "brick" in p:
        design["wallMaterial"] = "brick_wall"
        description_parts.append("As requested, **Brick Walls** are selected, providing a balance of structural integrity and moderate thermal mass.")

    if "pitch" in p or "slope" in p:
        design["roofType"] = "pitched"
        description_parts.append("A **Pitched Roof** (approx 30° angle) has been chosen to help shed precipitation and provide overhead air volume.")
    elif "vault" in p or "arch" in p:
        design["roofType"] = "vaulted"
        description_parts.append("A **Vaulted Roof** provides an aerodynamic profile and excellent heat stratification.")
    elif "flat" in p:
        design["roofType"] = "flat"
        description_parts.append("A **Flat Roof** is selected, which minimizes building volume and can be used for roof access.")

    # Cold Climate (High Altitude, Winter dominant)
    if climate["avg_min"] < 5 or climate["overall_min"] < -5:
        if not p or ("earth" not in p and "timber" not in p and "brick" not in p):
            design["wallMaterial"] = "rammed_earth"
        if not p or ("pitch" not in p and "vault" not in p and "flat" not in p):
            design["roofType"] = "pitched"
        design["roofMaterial"] = "insulated_panel"
        design["glazingType"] = "triple_glass"
        design["windowRatio"] = 25  # Maximize solar gain on south face
        design["insulationMm"] = 150
        if "description_parts" not in locals() or len(description_parts) == 1:
            description_parts.append("Due to extreme cold, we've optimized for heat retention: **Rammed Earth** for high thermal mass, **Pitched Roof** to shed snow, and thick **150mm insulation** with **Triple Glazing**.")
    
    # Hot Arid Climate (Desert, Summer dominant)
    elif climate["avg_max"] > 35 and climate["avg_min"] > 15:
        if not p or ("earth" not in p and "timber" not in p and "brick" not in p):
            design["wallMaterial"] = "rammed_earth" # Good for diurnal shift
        if not p or ("pitch" not in p and "vault" not in p and "flat" not in p):
            design["roofType"] = "flat" # Common in arid regions for roof access/shading
        design["roofMaterial"] = "concrete_slab"
        design["glazingType"] = "double_glass"
        design["windowRatio"] = 10  # Minimize solar gain
        design["insulationMm"] = 100
        if len(description_parts) == 1:
            description_parts.append("For this hot arid climate, we recommend **Rammed Earth** walls to delay heat transfer (diurnal lag), a **Flat Roof** with **Concrete Slab**, and a minimal **10% Window-to-Wall ratio** to prevent solar overheating.")
        
    # Hot Humid Climate (Tropical)
    elif climate["avg_min"] > 20 and climate["avg_max"] < 35:
        if not p or ("earth" not in p and "timber" not in p and "brick" not in p):
            design["wallMaterial"] = "aac_blocks" # Lightweight, less thermal mass needed
        if not p or ("pitch" not in p and "vault" not in p and "flat" not in p):
            design["roofType"] = "pitched" # Good for rain shedding
        design["roofMaterial"] = "metal_sheet" # Quick to cool down at night
        design["glazingType"] = "single_glass"
        design["windowRatio"] = 30  # Maximize cross ventilation
        design["insulationMm"] = 50
        if len(description_parts) == 1:
            description_parts.append("In this hot humid region, lightweight **AAC Blocks** and a **Pitched Metal Roof** are ideal to prevent trapping heat at night. We've maximized windows to **30%** for cross-ventilation.")
    
    # Temperate Climate
    else:
        if not p or ("earth" not in p and "timber" not in p and "brick" not in p):
            design["wallMaterial"] = "brick_wall"
        if not p or ("pitch" not in p and "vault" not in p and "flat" not in p):
            design["roofType"] = "pitched"
        design["roofMaterial"] = "concrete_slab"
        design["glazingType"] = "double_glass"
        design["windowRatio"] = 20
        design["insulationMm"] = 80
        if len(description_parts) == 1:
            description_parts.append("For a temperate climate, standard **Brick Walls** and a **Pitched Roof** provide a balanced, comfortable environment year-round with moderate **80mm insulation**.")
            
    description = "\n\n".join(description_parts)
    return design, description
