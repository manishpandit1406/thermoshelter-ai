from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.models.project import Project

router = APIRouter(prefix="/projects", tags=["projects"])

@router.get("")
def get_projects(db: Session = Depends(get_db)):
    projects = db.query(Project).order_by(Project.updated_at.desc()).all()
    return projects

@router.get("/{project_id}")
def get_project(project_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.post("")
def create_project(data: dict, db: Session = Depends(get_db)):
    project = Project(
        name=data.get("name", "New Project"),
        description=data.get("description", "")
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.put("/{project_id}")
def update_project(project_id: str, data: dict, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if "name" in data:
        project.name = data["name"]
    if "description" in data:
        project.description = data["description"]
    if "status" in data:
        project.status = data["status"]
        
    db.commit()
    db.refresh(project)
    return project

@router.delete("/{project_id}")
def delete_project(project_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()
    return {"message": "Project deleted"}

from app.models.location import Location

@router.get("/{project_id}/location")
def get_location(project_id: str, db: Session = Depends(get_db)):
    location = db.query(Location).filter(Location.project_id == project_id).first()
    if not location:
        return {}
    return {
        "name": location.name or "",
        "latitude": str(location.latitude) if location.latitude is not None else "",
        "longitude": str(location.longitude) if location.longitude is not None else "",
        "elevation": str(location.elevation) if location.elevation is not None else ""
    }

@router.put("/{project_id}/location")
def update_location(project_id: str, data: dict, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        project = Project(id=project_id, name="Recovered Project")
        db.add(project)
        db.commit()

    location = db.query(Location).filter(Location.project_id == project_id).first()
    if not location:
        location = Location(project_id=project_id)
        db.add(location)

    location.name = data.get("name", location.name if hasattr(location, 'name') and location.name else "Unknown Location")
    if "latitude" in data:
        location.latitude = float(data["latitude"])
    if "longitude" in data:
        location.longitude = float(data["longitude"])
    if "elevation" in data and data["elevation"]:
        location.elevation = float(data["elevation"])

    db.commit()
    return {"message": "Location saved"}
