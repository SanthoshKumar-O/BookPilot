from fastapi import APIRouter
from app.core.config import settings

router=APIRouter(tags=["Health"])

@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "app_name": settings.app_name,
        "app_version": settings.app_version,
    }