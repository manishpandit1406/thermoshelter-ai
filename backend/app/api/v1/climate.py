import requests
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.location import Location

router = APIRouter(prefix="/projects", tags=["climate"])

def determine_climate_zone(avg_temp: float, rainfall: float) -> str:
    if avg_temp > 25 and rainfall < 300:
        return "Hot Arid Desert"
    if avg_temp < 5:
        return "High Altitude / Cold"
    if avg_temp > 25 and rainfall > 1000:
        return "Tropical Humid"
    return "Temperate"

@router.get("/{project_id}/climate")
def get_climate(project_id: str, db: Session = Depends(get_db)):
    location = db.query(Location).filter(Location.project_id == project_id).first()
    
    if not location or not location.latitude or not location.longitude:
        raise HTTPException(status_code=400, detail="Location not set for this project")
        
    lat = location.latitude
    lng = location.longitude
    
    # Use Open-Meteo Historical Climate API to get monthly averages
    # Since historical climate takes long, we use normal historical data for a recent year (2022) to compute monthly averages.
    # We'll fetch daily mean temp, min, max, and precipitation for 2022 and average them by month.
    
    url = f"https://archive-api.open-meteo.com/v1/archive?latitude={lat}&longitude={lng}&start_date=2022-01-01&end_date=2022-12-31&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto"
    
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        daily = data.get("daily", {})
        dates = daily.get("time", [])
        t_max = daily.get("temperature_2m_max", [])
        t_min = daily.get("temperature_2m_min", [])
        precip = daily.get("precipitation_sum", [])
        
        monthly_data = []
        month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        
        total_precip = 0
        overall_min = 100
        overall_max = -100
        
        for m in range(12):
            m_str = f"-{m+1:02d}-"
            indices = [i for i, d in enumerate(dates) if m_str in d]
            
            if indices:
                avg_t = sum((t_max[i] + t_min[i]) / 2 for i in indices if t_max[i] is not None and t_min[i] is not None) / len(indices)
                sum_r = sum(precip[i] for i in indices if precip[i] is not None)
                
                m_max = max((t_max[i] for i in indices if t_max[i] is not None), default=0)
                m_min = min((t_min[i] for i in indices if t_min[i] is not None), default=0)
                
                if m_max > overall_max: overall_max = m_max
                if m_min < overall_min: overall_min = m_min
                total_precip += sum_r
                
                monthly_data.append({
                    "m": month_names[m],
                    "t": round(avg_t, 1),
                    "h": 30, # default placeholder humidity as openmeteo archive doesn't have daily RH easily
                    "r": round(sum_r, 1)
                })
            else:
                monthly_data.append({"m": month_names[m], "t": 20, "h": 30, "r": 0})
                
        avg_temp = sum(m["t"] for m in monthly_data) / 12
        zone = determine_climate_zone(avg_temp, total_precip)
        
        return {
            "zone": zone,
            "koppen": "Unknown",
            "color": "#F59E0B" if avg_temp > 20 else "#3B82F6",
            "avgTemp": round(avg_temp, 1),
            "maxTemp": overall_max,
            "minTemp": overall_min,
            "humidity": 30,
            "rainfall": round(total_precip, 1),
            "sunHours": 3200, # Approximate
            "monthly": monthly_data,
            "recommendations": [
                "Realtime weather data fetched from Open-Meteo",
                "Based on 2022 historical daily averages",
                "Use the AI Predictor on the Design page to get specific material recommendations!"
            ]
        }
        
    except Exception as e:
        print(f"Error fetching climate data: {e}")
        # Fallback to defaults
        return {
            "zone": "Unknown", "koppen": "Unk", "color": "#94A3B8",
            "avgTemp": 20.0, "maxTemp": 30.0, "minTemp": 10.0,
            "humidity": 50, "rainfall": 500, "sunHours": 3000,
            "monthly": [{"m": m, "t": 20, "h": 50, "r": 40} for m in ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]],
            "recommendations": ["Could not fetch real weather data."]
        }
