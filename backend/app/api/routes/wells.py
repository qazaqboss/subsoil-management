from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.well import Well

router = APIRouter()


@router.get("/")
def get_wells(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all wells"""
    return db.query(Well).offset(skip).limit(limit).all()


@router.get("/{well_id}")
def get_well(well_id: int, db: Session = Depends(get_db)):
    """Get a single well by ID"""
    well = db.query(Well).filter(Well.id == well_id).first()
    if not well:
        raise HTTPException(status_code=404, detail="Well not found")
    return well
