from pydantic import BaseModel
from datetime import date
from typing import Optional
from app.models.well import WellStatus


class WellOut(BaseModel):
    id: int
    number: str
    license_id: Optional[int] = None
    status: WellStatus
    design_depth: Optional[float] = None
    current_depth: Optional[float] = None
    drilling_start: Optional[date] = None
    field_name: Optional[str] = None
    contractor: Optional[str] = None
    supervisor: Optional[str] = None

    model_config = {"from_attributes": True}
