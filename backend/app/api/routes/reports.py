from __future__ import annotations
import io
import logging
from datetime import date, timedelta
from pathlib import Path
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse, StreamingResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.report import Report, ReportStatus
from app.models.well import Well
from app.models.license import License
from app.schemas.report import ReportOut

logger = logging.getLogger(__name__)
router = APIRouter()

_STATIC = Path(__file__).parent.parent.parent / "static" / "reports"

_STAGE_FILES = {
    1: "Otchet-Etap-1-Razvedka.pdf",
    2: "Otchet-Etap-2-Otsenka.pdf",
    3: "Otchet-Etap-3-Gos-Balans.pdf",
    4: "Otchet-Etap-4-Podgotovitelnyy.pdf",
    5: "Otchet-Etap-5-Polnomasshtabnaya.pdf",
    6: "Otchet-Etap-6-Likvidatsiya.pdf",
    7: "Otchet-Etap-7-Sdacha.pdf",
}

_STAGE_NAMES = {
    1: "Разведка", 2: "Оценка", 3: "Гос_Баланс",
    4: "Подготовительный", 5: "Полномасштабная",
    6: "Ликвидация", 7: "Сдача_территории",
}


@router.get("/pdf/stage/{stage_num}")
def download_stage_pdf(stage_num: int):
    if stage_num not in _STAGE_FILES:
        raise HTTPException(400, f"Этап должен быть от 1 до 7")
    pdf_path = _STATIC / _STAGE_FILES[stage_num]
    if not pdf_path.exists():
        raise HTTPException(404, f"PDF для Этапа {stage_num} не найден")
    fname = f"Subsoil_Etap_{stage_num}_{_STAGE_NAMES[stage_num]}.pdf"
    return FileResponse(str(pdf_path), media_type="application/pdf",
                        headers={"Content-Disposition": f'inline; filename="{fname}"'})


@router.get("/pdf/stages")
def list_stage_pdfs():
    result = []
    for n, fname in _STAGE_FILES.items():
        path = _STATIC / fname
        result.append({
            "stage": n, "name": _STAGE_NAMES[n],
            "available": path.exists(),
            "url": f"/api/reports/pdf/stage/{n}",
            "size_kb": round(path.stat().st_size / 1024) if path.exists() else 0,
        })
    return result


@router.get("/pdf/passport/{well_id}")
def download_passport_pdf(well_id: int, db: Session = Depends(get_db)):
    well = db.query(Well).filter(Well.id == well_id).first()
    if not well:
        raise HTTPException(404, "Скважина не найдена")
    lic = db.query(License).filter(License.id == well.license_id).first()
    try:
        pdf_bytes = _generate_passport_pdf(well, lic)
    except Exception as e:
        logger.exception("Passport PDF generation failed")
        raise HTTPException(500, f"Ошибка генерации PDF: {e}")
    fname = f"Passport_{well.number.replace('-','')}.pdf"
    return StreamingResponse(io.BytesIO(pdf_bytes), media_type="application/pdf",
                             headers={"Content-Disposition": f'inline; filename="{fname}"'})


def _find_font() -> str | None:
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/freefont/FreeSans.ttf",
        "/Library/Fonts/Arial Unicode.ttf",
        "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
    ]
    return next((p for p in candidates if Path(p).exists()), None)


def _generate_passport_pdf(well: Well, lic: License | None) -> bytes:
    from fpdf import FPDF

    font_path = _find_font()

    class PDF(FPDF):
        def header(self):
            if font_path:
                self.add_font("U", "", font_path)
                self.set_font("U", size=8)
            else:
                self.set_font("Helvetica", size=8)
            self.set_fill_color(8, 38, 78)
            self.set_text_color(255, 255, 255)
            co = lic.company if lic else "—"
            ln = lic.number if lic else "—"
            self.cell(0, 8, f"  ПАСПОРТ СКВАЖИНЫ  |  {co}  |  Лицензия {ln}",
                      fill=True, new_x="LMARGIN", new_y="NEXT")
            self.set_text_color(15, 15, 15)

    pdf = PDF("P", "mm", "A4")
    if font_path:
        pdf.add_font("U", "", font_path)
    pdf.add_page()

    if font_path:
        pdf.set_font("U", size=14)
    else:
        pdf.set_font("Helvetica", "B", 14)
    pdf.set_fill_color(8, 38, 78)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(0, 12, "  ПАСПОРТ СКВАЖИНЫ", fill=True, new_x="LMARGIN", new_y="NEXT")
    pdf.set_text_color(15, 15, 15)
    pdf.ln(4)

    if font_path:
        pdf.set_font("U", size=10)
    else:
        pdf.set_font("Helvetica", size=10)

    status_map = {
        "drilling": "Бурение", "testing": "Испытание",
        "production": "Добыча", "passportization": "Паспортизация",
        "completed": "Завершена",
    }

    rows = [
        ("Номер скважины",       str(well.number)),
        ("Месторождение",        str(well.field_name or "—")),
        ("Лицензия",             str(lic.number if lic else "—")),
        ("Компания",             str(lic.company if lic else "—")),
        ("Проектная глубина, м", str(well.design_depth or "—")),
        ("Текущая глубина, м",   str(well.current_depth or "—")),
        ("Дата забуривания",     str(well.drilling_start or "—")),
        ("Буровой подрядчик",    str(well.contractor or "—")),
        ("Супервайзер",          str(well.supervisor or "—")),
        ("Статус",               status_map.get(str(well.status.value if well.status else ""), "—")),
        ("Утверждающий орган",   "МЭиПР РК"),
        ("Нормативная база",     "КОНН РК ст.134-135 | Приказ МЭ РК №355"),
        ("Дата формирования",    str(date.today())),
    ]

    for label, val in rows:
        pdf.set_fill_color(218, 232, 255)
        pdf.cell(72, 7, f"  {label}", fill=True, border="B")
        pdf.set_fill_color(255, 255, 255)
        pdf.cell(112, 7, f"  {val}", fill=True, border="B", new_x="LMARGIN", new_y="NEXT")

    pdf.ln(6)
    if font_path:
        pdf.set_font("U", size=9)
    else:
        pdf.set_font("Helvetica", "I", 9)
    pdf.set_fill_color(240, 244, 255)
    pdf.set_text_color(30, 64, 175)
    pdf.multi_cell(
        0, 6,
        "Паспорт формируется согласно КОНН РК №125-VI ст. 134, 135 "
        "и Приказу МЭ РК №355 от 30.12.2014 (изм. 04.08.2023).",
        fill=True,
    )

    return bytes(pdf.output())


# ── Standard report CRUD ───────────────────────────────────────────────────────
@router.get("/", response_model=List[ReportOut])
def get_reports(
    license_id: Optional[int] = None,
    status: Optional[ReportStatus] = None,
    skip: int = 0, limit: int = 100,
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
    return (db.query(Report).filter(Report.status == ReportStatus.OVERDUE)
            .order_by(Report.deadline).all())


@router.get("/upcoming", response_model=List[ReportOut])
def get_upcoming(days: int = 7, db: Session = Depends(get_db)):
    today = date.today()
    cutoff = today + timedelta(days=days)
    return (
        db.query(Report)
        .filter(Report.deadline >= today, Report.deadline <= cutoff)
        .filter(Report.status.in_([ReportStatus.PENDING, ReportStatus.DRAFT]))
        .order_by(Report.deadline).all()
    )


@router.get("/{report_id}", response_model=ReportOut)
def get_report(report_id: int, db: Session = Depends(get_db)):
    r = db.query(Report).filter(Report.id == report_id).first()
    if not r:
        raise HTTPException(404, "Report not found")
    return r


@router.patch("/{report_id}/status", response_model=ReportOut)
def update_report_status(report_id: int, status: ReportStatus, db: Session = Depends(get_db)):
    r = db.query(Report).filter(Report.id == report_id).first()
    if not r:
        raise HTTPException(404, "Report not found")
    r.status = status
    if status == ReportStatus.SUBMITTED:
        r.submitted_date = date.today()
    db.commit()
    db.refresh(r)
    return r
