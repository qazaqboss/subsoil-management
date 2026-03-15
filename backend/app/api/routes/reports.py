from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.report import Report

router = APIRouter()


@router.get("/")
def get_reports(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all reports"""
    return db.query(Report).offset(skip).limit(limit).all()


@router.get("/overdue")
def get_overdue_reports(db: Session = Depends(get_db)):
    """Get all overdue reports"""
    from app.models.report import ReportStatus
    return db.query(Report).filter(Report.status == ReportStatus.OVERDUE).all()
