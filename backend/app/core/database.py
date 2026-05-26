from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# pool_pre_ping makes SQLAlchemy test the connection before using it,
# which prevents "connection closed" errors on Railway after idle periods.
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=300,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> bool:
    """Create all tables and seed demo data. Returns True on success."""
    try:
        # Import all models so SQLAlchemy knows about them
        from app.models import license, well, report, lifecycle  # noqa: F401

        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created/verified OK")
        _seed_demo_data()
        return True
    except Exception as e:
        logger.warning(f"Database init skipped (no DB yet?): {e}")
        return False


def _seed_demo_data():
    """Insert demo records if tables are empty."""
    from app.models.license import License, LicenseStatus, LicenseType
    from app.models.well import Well, WellStatus
    from app.models.report import Report, ReportStatus
    from datetime import date, timedelta

    db = SessionLocal()
    try:
        if db.query(License).count() > 0:
            return  # already seeded

        lic1 = License(
            number="МГ-00123",
            status=LicenseStatus.ACTIVE,
            license_type=LicenseType.COMBINED,
            resource="Нефть",
            company='ТОО "ЭкоМикс"',
            issued_date=date(2020, 1, 15),
            expires_date=date(2028, 1, 15),
            area_km2=120.5,
        )
        lic2 = License(
            number="РГ-00456",
            status=LicenseStatus.EXPIRING,
            license_type=LicenseType.EXPLORATION,
            resource="Газ",
            company='АО "GasExplore"',
            issued_date=date(2022, 6, 10),
            expires_date=date(2026, 6, 10),
            area_km2=45.2,
        )
        db.add_all([lic1, lic2])
        db.flush()

        today = date.today()
        db.add_all([
            Well(number="47", license_id=lic1.id, status=WellStatus.TESTING,
                 design_depth=3800, current_depth=3785, field_name="Каражанбас",
                 contractor='ТОО "KazDrilling"', supervisor="Иванов И.И.",
                 drilling_start=date(2026, 3, 1)),
            Well(number="45", license_id=lic1.id, status=WellStatus.PRODUCTION,
                 design_depth=3500, current_depth=3500, field_name="Каражанбас",
                 contractor='ТОО "KazDrilling"', drilling_start=date(2024, 5, 10)),
            Well(number="3", license_id=lic2.id, status=WellStatus.DRILLING,
                 design_depth=2200, current_depth=1450, field_name="Блок РГ-456",
                 contractor='АО "BurServis"', drilling_start=date(2026, 4, 1)),
        ])

        db.add_all([
            Report(license_id=lic1.id, form_type="1-ТП (недра)", period="Март 2026",
                   deadline=today - timedelta(days=3), status=ReportStatus.OVERDUE,
                   regulatory_body="МЭ РК", fine_amount=50),
            Report(license_id=lic1.id, form_type="2-ТП (воздух)", period="Март 2026",
                   deadline=today, status=ReportStatus.DRAFT,
                   regulatory_body="МЭиПР РК", fine_amount=30),
            Report(license_id=lic2.id, form_type="6-ГР", period="Q1 2026",
                   deadline=today + timedelta(days=30), status=ReportStatus.PENDING,
                   regulatory_body="МЭ РК", fine_amount=50),
        ])

        db.commit()
        logger.info("Demo data seeded OK")
    except Exception as e:
        db.rollback()
        logger.warning(f"Seed skipped: {e}")
    finally:
        db.close()
