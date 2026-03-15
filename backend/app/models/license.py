from sqlalchemy import Column, Integer, String, Float, Date, Enum, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum


class LicenseStatus(str, enum.Enum):
    ACTIVE = "active"
    EXPIRING = "expiring"
    EXPIRED = "expired"
    SUSPENDED = "suspended"


class LicenseType(str, enum.Enum):
    EXPLORATION = "exploration"
    PRODUCTION = "production"
    COMBINED = "combined"


class License(Base):
    __tablename__ = "licenses"

    id = Column(Integer, primary_key=True, index=True)
    number = Column(String, unique=True, index=True, nullable=False)
    status = Column(Enum(LicenseStatus), default=LicenseStatus.ACTIVE)
    license_type = Column(Enum(LicenseType), nullable=False)
    resource = Column(String, nullable=False)
    company = Column(String, nullable=False)
    issued_date = Column(Date, nullable=False)
    expires_date = Column(Date, nullable=False)
    area_km2 = Column(Float)

    wells = relationship("Well", back_populates="license")
    reports = relationship("Report", back_populates="license")
