import math

# --- MATERIAL PROPERTIES DICTIONARY ---
# U-values in W/m^2.K, Thermal Mass (Heat Capacity) in J/kg.K, Density in kg/m^3
MATERIALS = {
    "rammed_earth": {"u_value": 1.5, "density": 1800, "heat_capacity": 850},
    "concrete": {"u_value": 3.0, "density": 2400, "heat_capacity": 880},
    "aac_blocks": {"u_value": 0.3, "density": 600, "heat_capacity": 1050},
    "brick": {"u_value": 2.0, "density": 1900, "heat_capacity": 800},
    "metal_sheet": {"u_value": 5.0, "density": 7800, "heat_capacity": 450}, # Uninsulated
    "insulated_panel": {"u_value": 0.2, "density": 50, "heat_capacity": 1200},
}

GLAZING = {
    "single_glass": {"u_value": 5.8, "shgc": 0.85},
    "double_glass": {"u_value": 2.8, "shgc": 0.70},
    "triple_glass": {"u_value": 1.2, "shgc": 0.50},
}


def simulate_shelter(design_params, location_params):
    """
    Simulate the internal temperature of a shelter over a 24-hour cycle.
    Uses a 1D Lumped Capacitance Thermal Model.
    """
    # 1. Gather Geometry
    w = design_params.get("width", 8.0)
    l = design_params.get("length", 12.0)
    h = design_params.get("height", 3.0)
    
    wall_area = 2 * (w * h + l * h)
    roof_area = w * l
    floor_area = w * l
    
    window_ratio = design_params.get("window_ratio", 15.0) / 100.0
    window_area = wall_area * window_ratio
    net_wall_area = wall_area - window_area
    
    # 2. Gather Material Properties
    wall_mat = MATERIALS.get(design_params.get("wall_material", "rammed_earth"))
    roof_mat = MATERIALS.get(design_params.get("roof_material", "metal_sheet"))
    glazing = GLAZING.get(design_params.get("glazing_type", "double_glass"))
    
    u_wall = design_params.get("u_value_override") or wall_mat["u_value"]
    u_roof = roof_mat["u_value"]
    u_window = glazing["u_value"]
    shgc = glazing["shgc"]
    
    # 3. Calculate Overall UA (W/K)
    UA_wall = u_wall * net_wall_area
    UA_roof = u_roof * roof_area
    UA_window = u_window * window_area
    UA_total = UA_wall + UA_roof + UA_window
    
    # 4. Calculate Thermal Mass (C in J/K)
    # Assume 0.3m thickness for walls and 0.1m for roof if calculating mass
    wall_volume = net_wall_area * 0.3
    roof_volume = roof_area * 0.1
    
    C_wall = wall_volume * wall_mat["density"] * wall_mat["heat_capacity"]
    C_roof = roof_volume * roof_mat["density"] * roof_mat["heat_capacity"]
    C_total = design_params.get("thermal_mass_override") or (C_wall + C_roof)
    
    # Minimum thermal mass to prevent division by zero
    if C_total <= 0:
        C_total = 10000 
    
    import requests
    
    T_min = -15.0
    T_max = 5.0
    
    lat = location_params.get("lat")
    lng = location_params.get("lng")
    
    if lat is not None and lng is not None:
        try:
            # Fetch a simple forecast to get realistic min/max temps for the region
            res = requests.get(f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lng}&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1", timeout=5)
            if res.ok:
                data = res.json()
                if "daily" in data:
                    T_max = data["daily"]["temperature_2m_max"][0]
                    T_min = data["daily"]["temperature_2m_min"][0]
        except Exception:
            pass
            
    T_mean = (T_max + T_min) / 2
    T_amp = (T_max - T_min) / 2
    
    # 6. Generate Solar Irradiance Profile (W/m^2)
    # Peak solar radiation around noon
    peak_irradiance = 800.0 # W/m^2
    
    # Simulation Parameters
    dt = 3600 # 1 hour time step in seconds
    T_in = T_mean # Initial indoor temperature guess
    
    results = []
    total_solar_gain = 0
    total_heat_loss = 0
    
    # Run simulation for 48 hours to reach steady periodic state, keep last 24 hours
    for hour in range(48):
        h_24 = hour % 24
        
        # Ambient temp peaks at 15:00 (hour 15)
        T_out = T_mean + T_amp * math.cos(math.pi * (h_24 - 15) / 12)
        
        # Solar radiation (active from hour 7 to 17)
        if 7 <= h_24 <= 17:
            # Simple parabolic shape for daylight hours
            solar_irr = peak_irradiance * math.sin(math.pi * (h_24 - 7) / 10)
        else:
            solar_irr = 0.0
            
        # Q_solar = Irradiance * Window Area * SHGC (assuming windows face sun optimally for simplicity)
        Q_solar = solar_irr * window_area * shgc
        
        # Internal gains (people, equipment - assume small constant 200W)
        Q_internal = 200.0
        
        # Conduction Heat Loss
        Q_cond = UA_total * (T_in - T_out)
        
        # Finite Difference Update
        # C * dT/dt = Q_in - Q_out
        dT = (Q_solar + Q_internal - Q_cond) * dt / C_total
        T_in += dT
        
        if hour >= 24:
            results.append({
                "hour": h_24,
                "t_out": round(T_out, 1),
                "t_in": round(T_in, 1),
                "q_solar": round(Q_solar, 1),
                "q_loss": round(Q_cond, 1)
            })
            total_solar_gain += Q_solar * dt / 3600000 # kWh
            total_heat_loss += Q_cond * dt / 3600000 if Q_cond > 0 else 0
            
    # Heat flow breakdown
    loss_breakdown = {
        "walls": round((UA_wall / UA_total) * 100, 1),
        "roof": round((UA_roof / UA_total) * 100, 1),
        "windows": round((UA_window / UA_total) * 100, 1)
    }

    return {
        "hourly_data": results,
        "metrics": {
            "total_solar_gain_kwh": round(total_solar_gain, 2),
            "total_heat_loss_kwh": round(total_heat_loss, 2),
            "min_temp_in": min(r["t_in"] for r in results),
            "max_temp_in": max(r["t_in"] for r in results),
            "avg_temp_in": round(sum(r["t_in"] for r in results) / 24, 1),
            "loss_breakdown": loss_breakdown,
            "ua_total": round(UA_total, 1),
            "thermal_mass": round(C_total, 1)
        }
    }
