from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import licenses, reports, wells, ai

app = FastAPI(
    title="Subsoil Management API",
    description="API для автоматизации контроля лицензионных обязательств недропользователей Казахстана",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(licenses.router, prefix="/api/licenses", tags=["licenses"])
app.include_router(reports.router, prefix="/api/reports", tags=["reports"])
app.include_router(wells.router, prefix="/api/wells", tags=["wells"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])


@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "Subsoil Management API"}
