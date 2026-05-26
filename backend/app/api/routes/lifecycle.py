from fastapi import APIRouter, HTTPException
from typing import Optional
from pydantic import BaseModel

router = APIRouter(prefix="/lifecycle", tags=["lifecycle"])

# ─── Static stage definitions (mirrors frontend lifecycleData.ts) ─────────────

LIFECYCLE_STAGES = [
    {
        "code": "STG-01-EXPLORATION",
        "name": "Разведка",
        "short_name": "Разведка",
        "icon": "🔍",
        "macro_phase": "exploration",
        "sort_order": 1,
        "max_duration_years": None,
        "description": "Поисковый этап. Срок составления базового проекта: 1 год со дня регистрации контракта.",
        "regulatory_refs": [
            "КОНН РК №125-VI, ст. 134, 135",
            "ЭК РК №400-VI, ст. 67",
            "ЕПРКИН №239",
        ],
        "document_count": 2,
    },
    {
        "code": "STG-02-EVALUATION",
        "name": "Оценка",
        "short_name": "Оценка",
        "icon": "📊",
        "macro_phase": "exploration",
        "sort_order": 2,
        "max_duration_years": None,
        "description": "Оценочный этап + пробная эксплуатация.",
        "regulatory_refs": [
            "КОНН РК, ст. 134, 135, 136, 138",
            "ЭК РК, ст. 67",
            "Приказ МИИР №71 от 02.02.2023",
        ],
        "document_count": 4,
    },
    {
        "code": "STG-03-STATE-BALANCE",
        "name": "Государственный Баланс",
        "short_name": "Гос. Баланс",
        "icon": "⚖️",
        "macro_phase": "exploration",
        "sort_order": 3,
        "max_duration_years": None,
        "description": "Постановка запасов на Государственный баланс. Срок: 3 месяца с момента решения.",
        "regulatory_refs": ["КОНН РК, ст. 6, 142", "Приказ МИИР №71 от 02.02.2023"],
        "document_count": 2,
    },
    {
        "code": "STG-04-PREPARATORY",
        "name": "Подготовительный период",
        "short_name": "Подготовка",
        "icon": "🏗️",
        "macro_phase": "industrial",
        "sort_order": 4,
        "max_duration_years": 3,
        "description": "Подготовительный период добычи — не более 3 лет.",
        "regulatory_refs": [
            "КОНН РК, ст. 137, 138",
            "ЭК РК, ст. 67",
            "ЕПРКИН №239",
            "Приказ МЭ №200 от 22.05.2018",
        ],
        "document_count": 4,
    },
    {
        "code": "STG-05-FULL-DEVELOPMENT",
        "name": "Полномасштабная разработка",
        "short_name": "Разработка",
        "icon": "⛽",
        "macro_phase": "industrial",
        "sort_order": 5,
        "max_duration_years": 25,
        "description": "Промышленная добыча. До 25 лет (45 лет для крупных месторождений).",
        "regulatory_refs": ["КОНН РК, ст. 119, 142", "ЭК РК, ст. 67", "ЕПРКИН №239"],
        "document_count": 2,
    },
    {
        "code": "STG-06-LIQUIDATION",
        "name": "Проект ликвидации",
        "short_name": "Ликвидация",
        "icon": "🔧",
        "macro_phase": "return",
        "sort_order": 6,
        "max_duration_years": None,
        "description": "Ликвидация последствий недропользования. КОНН ст. 138.",
        "regulatory_refs": [
            "КОНН РК, ст. 138",
            "ЭК РК, ст. 9",
            "ЕПРКИН №239 (изм. 24.09.2024)",
            "Приказ МЭ №200 от 22.05.2018 (изм. №66 от 11.10.2024)",
        ],
        "document_count": 1,
    },
    {
        "code": "STG-07-TERRITORY-RETURN",
        "name": "Сдача контрактной территории",
        "short_name": "Сдача",
        "icon": "📋",
        "macro_phase": "return",
        "sort_order": 7,
        "max_duration_years": None,
        "description": "Окончательная сдача контрактной территории. КОНН ст. 107, 114, 116.",
        "regulatory_refs": [
            "КОНН РК, ст. 107, 114, 116",
            "Приказ МЭ №200 от 22.05.2018 (изм. №66 от 11.10.2024)",
        ],
        "document_count": 2,
    },
]

CALENDAR_TRIGGERS = [
    {
        "trigger": "contract_registered_at",
        "condition": "License.contract_registered_at is set",
        "action": "Create ProjectDocument(type=base_project, deadline=+1 year) for STG-01",
    },
    {
        "trigger": "work_started",
        "condition": "Signed act of work commencement",
        "action": "Schedule annual AuthorSupervisionReport",
    },
    {
        "trigger": "discovery_confirmed",
        "condition": "Well.discovery_confirmed = true",
        "action": "Create ProjectDocument(type=trial_operation, deadline=+3 months)",
    },
    {
        "trigger": "reserve_delta_20",
        "condition": "delta_percent > 0.20 after new reserve count",
        "action": "Create ReserveOperation(type=recalculation) + block approval",
    },
    {
        "trigger": "production_period_ending",
        "condition": "License.production_period_end - today < 365 days",
        "action": "Alert: Submit extension application",
    },
    {
        "trigger": "analysis_overdue",
        "condition": "last_analysis_date + 3 years - today < 90 days",
        "action": "Alert + create draft analysis report",
    },
    {
        "trigger": "return_initiated",
        "condition": "License.return_initiated = true",
        "action": "Create LiquidationProject + TerritoryReturnReport",
    },
]


# ─── Pydantic schemas ─────────────────────────────────────────────────────────

class ReserveCalculationRequest(BaseModel):
    approved_reserves: float
    new_reserves: float


class ReserveCalculationResponse(BaseModel):
    approved_reserves: float
    new_reserves: float
    delta_percent: float
    is_blocked: bool
    message: str


# ─── Endpoints ────────────────────────────────────────────────────────────────

@router.get("/stages")
def list_stages():
    """Возвращает все 7 этапов жизненного цикла."""
    return {"stages": LIFECYCLE_STAGES, "total": len(LIFECYCLE_STAGES)}


@router.get("/stages/{stage_code}")
def get_stage(stage_code: str):
    """Детали конкретного этапа по коду (STG-01-EXPLORATION, ...)."""
    stage = next((s for s in LIFECYCLE_STAGES if s["code"] == stage_code), None)
    if not stage:
        raise HTTPException(status_code=404, detail=f"Stage '{stage_code}' not found")
    return stage


@router.get("/calendar-triggers")
def list_calendar_triggers():
    """Список автоматических триггеров для генерации дедлайнов."""
    return {"triggers": CALENDAR_TRIGGERS}


@router.post("/reserves/check-delta", response_model=ReserveCalculationResponse)
def check_reserve_delta(payload: ReserveCalculationRequest):
    """
    Рассчитывает delta_percent изменения запасов.
    При delta > 20% блокирует утверждение и требует прохождения ГКЗ РК.
    КОНН РК ст. 142, STG-05-FULL-DEVELOPMENT.
    """
    if payload.approved_reserves <= 0:
        raise HTTPException(status_code=422, detail="approved_reserves must be > 0")

    delta = abs(payload.new_reserves - payload.approved_reserves) / payload.approved_reserves
    is_blocked = delta > 0.20

    return ReserveCalculationResponse(
        approved_reserves=payload.approved_reserves,
        new_reserves=payload.new_reserves,
        delta_percent=round(delta * 100, 2),
        is_blocked=is_blocked,
        message=(
            "⛔ Изменение запасов > 20% — требуется пересчёт и защита в ГКЗ РК (КОНН ст. 142). "
            "Утверждение заблокировано до прохождения фаз ГКЗ."
            if is_blocked
            else f"✅ Изменение {round(delta * 100, 2)}% — в пределах нормы, пересчёт не требуется."
        ),
    )


@router.get("/ai-context")
def get_ai_context():
    """Системный промпт для AI-агента — нормативная база и описание 7 этапов."""
    return {
        "system_prompt": """Ты юридический ассистент Subsoil. Используй ТОЛЬКО следующую нормативную базу:

КОНН РК №125-VI от 27.12.2017 (последние изменения 10.06.2025):
  - ст. 107: прекращение права недропользования
  - ст. 113: морские проекты и увеличение участка
  - ст. 114: добровольный возврат части участка
  - ст. 116: досрочное прекращение периода разведки
  - ст. 119 п.7: обязательства по крупным месторождениям (>100 млн т / >50 млрд м³)
  - ст. 134, 135: проекты разведочных работ (поиск/оценка)
  - ст. 136: пробная эксплуатация (изм. 22.07.2024)
  - ст. 137: проект разработки месторождения (изм. 22.07.2024)
  - ст. 138: ликвидация последствий недропользования (изм. 10.06.2025)
  - ст. 142: авторский надзор

ЭК РК №400-VI от 02.01.2021 (изм. 29.07.2025):
  - ст. 9: проект ликвидации
  - ст. 67: ОВВ/РООС
  - ст. 68: заявление о намечаемой деятельности

ЕПРКИН №239 от 15.06.2018 (изм. 24.09.2024) — все главы.

7 этапов жизненного цикла: STG-01 (Разведка) → STG-07 (Сдача территории).
При ответе ВСЕГДА указывай конкретную статью и дату последней редакции.""",
        "stages_count": 7,
        "stages": [s["code"] for s in LIFECYCLE_STAGES],
    }
