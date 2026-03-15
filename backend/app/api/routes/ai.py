from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class ChatMessage(BaseModel):
    message: str
    context: str | None = None


@router.post("/chat")
async def chat(payload: ChatMessage):
    """AI Assistant endpoint — integrate with Claude API in production"""
    # TODO: Integrate with Claude API (claude-sonnet-4-6)
    return {
        "response": f"Демо-ответ на вопрос: '{payload.message}'. Подключите Claude API для реальных ответов.",
        "sources": ["Кодекс РК 'О недрах'", "Приказ МЭ РК №234"],
    }
