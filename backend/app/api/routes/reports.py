from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from app.core.database import get_db
from app.models.report import Report, ReportStatus
from app.schemas.report import ReportOut

router = APIRouter()


@router.get("/", response_model=List[ReportOut])
def get_reports(
    license_id: Optional[int] = None,
    status: Optional[ReportStatus] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    q = db.query(Report)
    if license_id:
        q = q.filter(Report.license_id == license_id)
    if status:
        q = q.filter(Report.status == status)
    return q.offset(skip).limit(limit).all()


@router.get("/overdue", response_model=List[ReportOut])
def get_overdue(db: Session = Depends(get_db)):
    today = date.today()
    return (
        db.query(Report)
        .filter(Report.status == ReportStatus.OVERDUE)
        .order_by(Report.deadline)
        .all()
    )


@router.get("/upcoming", response_model=List[ReportOut])
def get_upcoming(days: int = 7, db: Session = Depends(get_db)):
    from datetime import timedelta
    today = date.today()
    cutoff = today + timedelta(days=days)
    return (
        db.query(Report)
        .filter(Report.deadline >= today, Report.deadline <= cutoff)
        .filter(Report.status.in_([ReportStatus.PENDING, ReportStatus.DRAFT]))
        .order_by(Report.deadline)
        .all()
    )


@router.get("/{report_id}", response_model=ReportOut)
def get_report(report_id: int, db: Session = Depends(get_db)):
    r = db.query(Report).filter(Report.id == report_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Report not found")
    return r


@router.patch("/{report_id}/status", response_model=ReportOut)
def update_report_status(report_id: int, status: ReportStatus, db: Session = Depends(get_db)):
    r = db.query(Report).filter(Report.id == report_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Report not found")
    r.status = status
    if status == ReportStatus.SUBMITTED:
        r.submitted_date = date.today()
    db.commit()
    db.refresh(r)
    return r
