from __future__ import annotations
import asyncio
import logging
import os
from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.core.config import settings
from app.data.lifecycle_context import LIFECYCLE_SYSTEM_PROMPT

logger = logging.getLogger(__name__)
router = APIRouter()

_VAULT_KB: str = ""
_PRIORITY = {"00-Home", "09-ERP", "08-Reports", "10.01", "10.02", "10.03",
              "35.00", "40.01", "40.02", "85.01", "90.14"}


def _load_vault_kb() -> str:
    roots = [Path(os.getenv("VAULT_PATH", "/nonexistent")), Path("/vault")]
    root = next((r for r in roots if r.exists() and any(r.rglob("*.md"))), None)
    if not root:
        return ""
    chunks: list[str] = []
    for md in sorted(root.rglob("*.md"))[:120]:
        try:
            text = md.read_text(encoding="utf-8", errors="ignore").strip()
            if len(text) < 80:
                continue
            limit = 3000 if any(p in md.name for p in _PRIORITY) else 1500
            entry = f"=== {md.stem} ===\n{text[:limit]}"
            if any(p in md.name for p in _PRIORITY):
                chunks.insert(0, entry)
            else:
                chunks.append(entry)
        except Exception:
            pass
    return "\n\n".join(chunks[:80])


def _get_system_prompt(context: str | None = None) -> str:
    global _VAULT_KB
    if not _VAULT_KB:
        _VAULT_KB = _load_vault_kb()
        if _VAULT_KB:
            logger.info(f"Vault KB: {len(_VAULT_KB)} chars")
    prompt = LIFECYCLE_SYSTEM_PROMPT
    if _VAULT_KB:
        prompt += (
            "\n\n===БАЗА ЗНАНИЙ ПРОЕКТА===\n" + _VAULT_KB[:55_000]
        )
    if context:
        prompt += f"\n\n[Контекст ERP: {context}]"
    return prompt


class ChatMessage(BaseModel):
    message: str
    history: list[dict] | None = None
    context: str | None = None


class ChatResponse(BaseModel):
    response: str
    sources: list[str]


@router.post("/chat", response_model=ChatResponse)
async def chat(payload: ChatMessage):
    if not settings.ANTHROPIC_API_KEY:
        raise HTTPException(503, "ANTHROPIC_API_KEY не настроен. Добавьте переменную на Railway.")

    try:
        import anthropic
        client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

        messages: list[dict] = []
        for msg in (payload.history or []):
            if msg.get("role") in ("user", "assistant"):
                messages.append({"role": msg["role"], "content": str(msg["content"])})
        messages.append({"role": "user", "content": payload.message})

        system = _get_system_prompt(payload.context)
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None,
            lambda: client.messages.create(
                model="claude-sonnet-4-6",
                max_tokens=2048,
                system=system,
                messages=messages,
            ),
        )
        answer = response.content[0].text
        return ChatResponse(response=answer, sources=_extract_sources(answer))

    except Exception as e:
        err = str(e)
        if "credit" in err.lower() or "billing" in err.lower():
            raise HTTPException(402, "Недостаточно кредитов API.")
        if "authentication" in err.lower():
            raise HTTPException(401, "Неверный ANTHROPIC_API_KEY")
        if "rate" in err.lower():
            raise HTTPException(429, "Превышен лимит запросов.")
        logger.exception("Claude API error")
        raise HTTPException(500, f"Ошибка Claude API: {err[:300]}")


def _extract_sources(text: str) -> list[str]:
    sources = []
    for kw, label in [
        ("КОНН", "КОНН РК №125-VI"), ("ст. 134", "КОНН ст. 134, 135"),
        ("ст. 136", "КОНН ст. 136 (ПЭ)"), ("ст. 137", "КОНН ст. 137 (ПР)"),
        ("ст. 138", "КОНН ст. 138 (Ликвидация)"), ("ст. 142", "КОНН ст. 142 (Авторнадзор)"),
        ("ЭК РК", "ЭК РК №400-VI"), ("ст. 67", "ЭК ст. 67 (ОВВ/РООС)"),
        ("ЕПРКИН", "ЕПРКИН №239"), ("ГКЗ", "Регламент ГКЗ РК"),
        ("ЦКРР", "Регламент ЦКРР"), ("МРП", "КоАП РК"),
        ("№200", "Приказ МЭ №200"), ("№355", "Приказ МЭ №355 (паспорт)"),
        ("МИИР", "Приказ МИИР №71"),
    ]:
        if kw in text and label not in sources:
            sources.append(label)
    return sources[:5]
