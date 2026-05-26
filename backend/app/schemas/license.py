from pydantic import BaseModel
from datetime import date
from typing import Optional
from app.models.license import LicenseStatus, LicenseType


class LicenseBase(BaseModel):
    number: str
    license_type: LicenseType
    resource: str
    company: str
    issued_date: date
    expires_date: date
    area_km2: Optional[float] = None


class LicenseCreate(LicenseBase):
    pass


class LicenseOut(LicenseBase):
    id: int
    status: LicenseStatus

    model_config = {"from_attributes": True}
