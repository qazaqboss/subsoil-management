from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.config import settings
from app.data.lifecycle_context import LIFECYCLE_SYSTEM_PROMPT

router = APIRouter()


class ChatMessage(BaseModel):
    message: str
    history: list[dict] | None = None  # [{role: "user"|"assistant", content: str}]


class ChatResponse(BaseModel):
    response: str
    sources: list[str]


@router.post("/chat", response_model=ChatResponse)
async def chat(payload: ChatMessage):
    if not settings.ANTHROPIC_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="ANTHROPIC_API_KEY не настроен. Добавьте переменную окружения на Railway.",
        )

    try:
        import anthropic

        client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

        messages = []
        for msg in (payload.history or []):
            if msg.get("role") in ("user", "assistant"):
                messages.append({"role": msg["role"], "content": msg["content"]})

        messages.append({"role": "user", "content": payload.message})

        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1024,
            system=LIFECYCLE_SYSTEM_PROMPT,
            messages=messages,
        )

        answer = response.content[0].text
        sources = _extract_sources(answer)

        return ChatResponse(response=answer, sources=sources)

    except anthropic.AuthenticationError:
        raise HTTPException(status_code=401, detail="Неверный ANTHROPIC_API_KEY")
    except anthropic.RateLimitError:
        raise HTTPException(status_code=429, detail="Превышен лимит запросов к Claude API")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка Claude API: {str(e)}")


def _extract_sources(text: str) -> list[str]:
    """Извлекает упомянутые НПА из ответа для отображения в UI."""
    sources = []
    patterns = [
        ("КОНН", "КОНН РК №125-VI"),
        ("ст. 134", "КОНН ст. 134, 135"),
        ("ст. 137", "КОНН ст. 137"),
        ("ст. 138", "КОНН ст. 138"),
        ("ст. 142", "КОНН ст. 142"),
        ("ЭК РК", "ЭК РК №400-VI"),
        ("ст. 67", "ЭК ст. 67 (ОВВ/РООС)"),
        ("ЕПРКИН", "ЕПРКИН №239"),
        ("ГКЗ", "Регламент ГКЗ РК"),
        ("ЦКРР", "Регламент ЦКРР"),
        ("МРП", "КоАП РК"),
    ]
    for keyword, label in patterns:
        if keyword in text and label not in sources:
            sources.append(label)
    return sources[:4]
