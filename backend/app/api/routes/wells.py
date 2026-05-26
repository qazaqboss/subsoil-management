from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.well import Well, WellStatus
from app.schemas.well import WellOut

router = APIRouter()


@router.get("/", response_model=List[WellOut])
def get_wells(
    license_id: Optional[int] = None,
    status: Optional[WellStatus] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    q = db.query(Well)
    if license_id:
        q = q.filter(Well.license_id == license_id)
    if status:
        q = q.filter(Well.status == status)
    return q.offset(skip).limit(limit).all()


@router.get("/{well_id}", response_model=WellOut)
def get_well(well_id: int, db: Session = Depends(get_db)):
    well = db.query(Well).filter(Well.id == well_id).first()
    if not well:
        raise HTTPException(status_code=404, detail="Well not found")
    return well
