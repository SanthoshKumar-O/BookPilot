from fastapi import APIRouter

from app.api.health import router as health_router
from app.modules.ai.router import router as ai_router
from app.modules.analytics.router import router as analytics_router
from app.modules.auth.router import router as auth_router
from app.modules.coding.router import router as coding_router
from app.modules.learning.router import router as learning_router
from app.modules.reader.router import router as reader_router
from app.modules.recommendations.router import router as recommendations_router
from app.modules.resources.router import router as resources_router

api_router = APIRouter()

api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(resources_router)
api_router.include_router(reader_router)
api_router.include_router(ai_router)
api_router.include_router(learning_router)
api_router.include_router(coding_router)
api_router.include_router(analytics_router)
api_router.include_router(recommendations_router)