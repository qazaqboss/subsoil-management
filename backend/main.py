import logging
import os
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api.routes import licenses, reports, wells, ai, lifecycle
from app.core.config import settings
from app.core.database import init_db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Absolute path to dist/ — works regardless of working directory
DIST_DIR = Path("/app/dist")


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

    dist_exists = DIST_DIR.exists()
    dist_has_index = (DIST_DIR / "index.html").exists() if dist_exists else False

    return {
        "status": "ok",
        "service": "Subsoil Management API",
        "db": db_status,
        "frontend": {
            "dist_path": str(DIST_DIR),
            "dist_exists": dist_exists,
            "index_html": dist_has_index,
        },
        "cors_origins": origins,
    }


# Serve React SPA — must be LAST so /api/* routes take priority
if DIST_DIR.exists() and (DIST_DIR / "index.html").exists():
    app.mount("/", StaticFiles(directory=str(DIST_DIR), html=True), name="static")
    logger.info(f"Serving React frontend from {DIST_DIR}")
else:
    logger.warning(f"Frontend dist not found at {DIST_DIR} — only API available")
