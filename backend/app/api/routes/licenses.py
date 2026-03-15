from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.license import License
from typing import List

router = APIRouter()


@router.get("/")
def get_licenses(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all licenses with pagination"""
    licenses = db.query(License).offset(skip).limit(limit).all()
    return licenses


@router.get("/{license_id}")
def get_license(license_id: int, db: Session = Depends(get_db)):
    """Get a single license by ID"""
    license = db.query(License).filter(License.id == license_id).first()
    if not license:
        raise HTTPException(status_code=404, detail="License not found")
    return license
