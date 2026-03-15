from sqlalchemy import Column, Integer, String, Float, Date, Enum, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum


class WellStatus(str, enum.Enum):
    DRILLING = "drilling"
    TESTING = "testing"
    PRODUCTION = "production"
    PASSPORTIZATION = "passportization"
    COMPLETED = "completed"


class Well(Base):
    __tablename__ = "wells"

    id = Column(Integer, primary_key=True, index=True)
    number = Column(String, nullable=False)
    license_id = Column(Integer, ForeignKey("licenses.id"))
    status = Column(Enum(WellStatus), default=WellStatus.DRILLING)
    design_depth = Column(Float)
    current_depth = Column(Float)
    drilling_start = Column(Date)
    field_name = Column(String)
    contractor = Column(String)
    supervisor = Column(String)

    license = relationship("License", back_populates="wells")
