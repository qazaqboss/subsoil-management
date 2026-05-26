from pydantic import BaseModel
from datetime import date
from typing import Optional
from app.models.report import ReportStatus


class ReportOut(BaseModel):
    id: int
    license_id: Optional[int] = None
    form_type: str
    period: Optional[str] = None
    deadline: date
    submitted_date: Optional[date] = None
    status: ReportStatus
    regulatory_body: Optional[str] = None
    fine_amount: Optional[int] = None
    notes: Optional[str] = None

    model_config = {"from_attributes": True}
