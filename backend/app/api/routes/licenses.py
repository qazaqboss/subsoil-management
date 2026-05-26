from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.license import License, LicenseStatus
from app.schemas.license import LicenseOut, LicenseCreate

router = APIRouter()


@router.get("/", response_model=List[LicenseOut])
def get_licenses(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(License).offset(skip).limit(limit).all()


@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    total = db.query(License).count()
    active = db.query(License).filter(License.status == LicenseStatus.ACTIVE).count()
    expiring = db.query(License).filter(License.status == LicenseStatus.EXPIRING).count()
    expired = db.query(License).filter(License.status == LicenseStatus.EXPIRED).count()
    return {"total": total, "active": active, "expiring": expiring, "expired": expired}


@router.get("/{license_id}", response_model=LicenseOut)
def get_license(license_id: int, db: Session = Depends(get_db)):
    lic = db.query(License).filter(License.id == license_id).first()
    if not lic:
        raise HTTPException(status_code=404, detail="License not found")
    return lic


@router.post("/", response_model=LicenseOut, status_code=201)
def create_license(payload: LicenseCreate, db: Session = Depends(get_db)):
    existing = db.query(License).filter(License.number == payload.number).first()
    if existing:
        raise HTTPException(status_code=409, detail=f"License {payload.number} already exists")
    lic = License(**payload.model_dump())
    db.add(lic)
    db.commit()
    db.refresh(lic)
    return lic


@router.patch("/{license_id}/status", response_model=LicenseOut)
def update_status(license_id: int, status: LicenseStatus, db: Session = Depends(get_db)):
    lic = db.query(License).filter(License.id == license_id).first()
    if not lic:
        raise HTTPException(status_code=404, detail="License not found")
    lic.status = status
    db.commit()
    db.refresh(lic)
    return lic
