import logging
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api.routes import licenses, reports, wells, ai, lifecycle
from app.core.config import settings
from app.core.database import init_db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    ok = init_db()
    if ok:
        logger.info("DB ready")
    else:
        logger.warning("Running without DB — some endpoints will return 503")
    yield


app = FastAPI(
    title="Subsoil Management API",
    description="ERP для автоматизации контроля лицензионных обязательств недропользователей Казахстана",
    version="1.0.0",
    lifespan=lifespan,
)

origins = settings.cors_origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=origins != ["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(licenses.router, prefix="/api/licenses", tags=["licenses"])
app.include_router(reports.router, prefix="/api/reports", tags=["reports"])
app.include_router(wells.router, prefix="/api/wells", tags=["wells"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])
app.include_router(lifecycle.router, prefix="/api", tags=["lifecycle"])


@app.get("/api/health")
def health_check():
    from app.core.database import engine
    try:
        with engine.connect() as conn:
            from sqlalchemy import text
            conn.execute(text("SELECT 1"))
        db_status = "ok"
    except Exception as e:
        db_status = f"error: {e}"

    return {
        "status": "ok",
        "service": "Subsoil Management API",
        "db": db_status,
        "cors_origins": origins,
    }


# Serve React SPA — must be last so API routes take priority
DIST_DIR = os.path.join(os.path.dirname(__file__), "dist")
if os.path.exists(DIST_DIR):
    app.mount("/", StaticFiles(directory=DIST_DIR, html=True), name="static")
    logger.info(f"Serving frontend from {DIST_DIR}")
