from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.models import User, UserStat
from app.db.session import get_db
from app.modules.auth.dependencies import get_current_user

router = APIRouter(prefix="/analytics", tags=["Analytics"])


class StatsResponse(BaseModel):
    resources_completed: int
    chapters_completed: int
    total_reading_seconds: int
    quizzes_taken: int
    quizzes_passed: int
    coding_problems_solved: int
    current_streak: int

    class Config:
        from_attributes = True


@router.get("/stats", response_model=StatsResponse)
def get_user_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get aggregated analytics dashboard statistics for current user."""
    stat = db.query(UserStat).filter(UserStat.user_id == current_user.id).first()
    if not stat:
        stat = UserStat(user_id=current_user.id)
        db.add(stat)
        db.commit()
        db.refresh(stat)
    return stat
