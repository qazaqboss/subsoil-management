from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/subsoil_db"
    SECRET_KEY: str = "change-me-in-production-use-long-random-string"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ANTHROPIC_API_KEY: str = ""
    # Comma-separated list of allowed origins, e.g.:
    # https://subsoil-frontend.railway.app,https://subsoil.app
    # Leave empty to allow all origins (ok for dev, not for prod)
    ALLOWED_ORIGINS: str = ""

    class Config:
        env_file = ".env"

    @property
    def cors_origins(self) -> List[str]:
        if not self.ALLOWED_ORIGINS.strip():
            return ["*"]
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]


settings = Settings()
