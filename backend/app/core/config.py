from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration loaded from environment variables."""

    app_name: str = "BookPilot API"
    app_version: str = "1.0.0"

    debug: bool = False

    database_url: str

    secret_key: str

    algorithm: str = "HS256"

    access_token_expire_minutes: int = 30

    # Optional LLM API Keys (Free Tier Supported)
    gemini_api_key: str = ""
    openai_api_key: str = ""
    groq_api_key: str = ""


    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    """Return a cached Settings instance."""
    return Settings()


settings = get_settings()