from sqlalchemy import Column, Integer, String, Float, Date, DateTime, Enum, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum


class MacroPhase(str, enum.Enum):
    EXPLORATION = "exploration"
    INDUSTRIAL = "industrial"
    RETURN = "return"


class DocumentType(str, enum.Enum):
    BASE_PROJECT = "base_project"
    TECHNICAL_PROJECT = "technical_project"
    GEOLOGICAL_REPORT = "geological_report"
    LIQUIDATION = "liquidation"
    AUTHOR_SUPERVISION = "author_supervision"
    RESERVE_OPERATION = "reserve_operation"


class PhaseStatus(str, enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    DONE = "done"
    OVERDUE = "overdue"


class DocumentStatus(str, enum.Enum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    COMPLETED = "completed"


class LifecycleStage(Base):
    __tablename__ = "lifecycle_stages"

    id = Column(Integer, primary_key=True, index=True)
    stage_code = Column(String(50), unique=True, nullable=False)  # STG-01-EXPLORATION
    stage_name = Column(String(200), nullable=False)
    short_name = Column(String(100), nullable=False)
    icon = Column(String(10))
    macro_phase = Column(Enum(MacroPhase), nullable=False)
    max_duration_years = Column(Integer, nullable=True)
    sort_order = Column(Integer, nullable=False)
    description = Column(Text)
    regulatory_refs = Column(Text)  # JSON array

    project_documents = relationship("ProjectDocument", back_populates="stage")


class Authority(Base):
    """Регуляторные органы — МЭиПР, ГКЗ, ЦКРР, МД и т.д."""
    __tablename__ = "authorities"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, nullable=False)  # MEMINPR | GKZ | TCKRR
    name = Column(String(300), nullable=False)
    authority_type = Column(String(50))  # ministry | commission | department
    region = Column(String(100), nullable=True)

    stage_phases = relationship("StagePhase", back_populates="authority")


class ProjectDocument(Base):
    __tablename__ = "project_documents"

    id = Column(Integer, primary_key=True, index=True)
    license_id = Column(Integer, ForeignKey("licenses.id"), nullable=False)
    stage_id = Column(Integer, ForeignKey("lifecycle_stages.id"), nullable=False)
    document_type = Column(Enum(DocumentType), nullable=False)
    title = Column(String(500), nullable=False)
    konn_article = Column(String(50))
    ek_article = Column(String(50))
    eprkin_clause = Column(String(100))
    methodical_rec = Column(Text)
    status = Column(Enum(DocumentStatus), default=DocumentStatus.DRAFT)
    submission_date = Column(Date, nullable=True)
    completion_deadline = Column(Date, nullable=True)
    requires_complex_contract_update = Column(Boolean, default=False)
    is_offshore = Column(Boolean, default=False)
    trigger_description = Column(Text)
    notes = Column(Text)

    stage = relationship("LifecycleStage", back_populates="project_documents")
    phases = relationship("StagePhase", back_populates="project_document", cascade="all, delete-orphan")
    checklist_items = relationship("ChecklistItem", back_populates="project_document", cascade="all, delete-orphan")


class StagePhase(Base):
    __tablename__ = "stage_phases"

    id = Column(Integer, primary_key=True, index=True)
    project_document_id = Column(Integer, ForeignKey("project_documents.id"), nullable=False)
    authority_id = Column(Integer, ForeignKey("authorities.id"), nullable=True)
    phase_number = Column(Integer, nullable=False)
    phase_name = Column(String(500), nullable=False)
    sla_days = Column(Integer, nullable=True)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    status = Column(Enum(PhaseStatus), default=PhaseStatus.PENDING)
    protocol_number = Column(String(100))
    notes = Column(Text)

    project_document = relationship("ProjectDocument", back_populates="phases")
    authority = relationship("Authority", back_populates="stage_phases")


class ChecklistItem(Base):
    __tablename__ = "checklist_items"

    id = Column(Integer, primary_key=True, index=True)
    project_document_id = Column(Integer, ForeignKey("project_documents.id"), nullable=False)
    item_text = Column(Text, nullable=False)
    is_completed = Column(Boolean, default=False)
    sort_order = Column(Integer, default=0)

    project_document = relationship("ProjectDocument", back_populates="checklist_items")


class AuthorSupervisionReport(Base):
    """Ежегодный отчёт авторского надзора (КОНН ст. 142, ЕПРКИН гл. 5 п. 55)"""
    __tablename__ = "author_supervision_reports"

    id = Column(Integer, primary_key=True, index=True)
    project_document_id = Column(Integer, ForeignKey("project_documents.id"), nullable=False)
    report_year = Column(Integer, nullable=False)
    konn_article = Column(String(20), default="142")
    technological_compliance = Column(Text)
    deviation_reasons = Column(Text)
    recommendations = Column(Text)
    submitted_to_meminpr_at = Column(DateTime, nullable=True)
    delivered_to_operator_at = Column(DateTime, nullable=True)


class ReserveOperation(Base):
    """Подсчёт/пересчёт/перевод запасов. Блокирует утверждение при delta > 20%."""
    __tablename__ = "reserve_operations"

    id = Column(Integer, primary_key=True, index=True)
    license_id = Column(Integer, ForeignKey("licenses.id"), nullable=False)
    operation_type = Column(String(50), nullable=False)  # operative_count | balance_count | reclassification | recalculation
    from_category = Column(String(10))   # C2 | C1 | A — для перевода
    to_category = Column(String(10))
    approved_reserves = Column(Float)    # ранее утверждённые в ГКЗ
    new_reserves = Column(Float)         # новый подсчёт
    delta_percent = Column(Float)        # |new - approved| / approved * 100
    is_blocked = Column(Boolean, default=False)  # True если delta > 20%
    approved_in_gkz_at = Column(Date, nullable=True)
    notes = Column(Text)


class LiquidationProject(Base):
    """Проект ликвидации — STG-06, КОНН ст. 138"""
    __tablename__ = "liquidation_projects"

    id = Column(Integer, primary_key=True, index=True)
    license_id = Column(Integer, ForeignKey("licenses.id"), nullable=False)
    trigger = Column(String(50))  # right_terminated | partial_return | full_return
    is_offshore = Column(Boolean, default=False)
    konn_article = Column(String(20), default="138")
    notification_to_me_at = Column(DateTime, nullable=True)
    commission_order_at = Column(DateTime, nullable=True)
    final_act_at = Column(DateTime, nullable=True)
    notes = Column(Text)
