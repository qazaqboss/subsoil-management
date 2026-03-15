from sqlalchemy import Column, Integer, String, Date, Enum, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum


class ReportStatus(str, enum.Enum):
    PENDING = "pending"
    DRAFT = "draft"
    SUBMITTED = "submitted"
    OVERDUE = "overdue"


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    license_id = Column(Integer, ForeignKey("licenses.id"))
    form_type = Column(String, nullable=False)
    period = Column(String)
    deadline = Column(Date, nullable=False)
    submitted_date = Column(Date)
    status = Column(Enum(ReportStatus), default=ReportStatus.PENDING)
    regulatory_body = Column(String)
    fine_amount = Column(Integer)
    notes = Column(Text)

    license = relationship("License", back_populates="reports")
