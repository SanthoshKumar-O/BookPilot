from datetime import datetime
from typing import Any, List, Optional
from pydantic import BaseModel


class StudyPlanCreate(BaseModel):
    resource_id: str
    target_completion_date: datetime
    daily_goal_minutes: int = 30


class StudyPlanResponse(BaseModel):
    id: str
    resource_id: str
    target_completion_date: datetime
    daily_goal_minutes: int
    current_streak_days: int
    is_active: bool

    class Config:
        from_attributes = True


class QuizQuestionResponse(BaseModel):
    id: str
    question_text: str
    question_type: str
    options: Optional[Any] = None
    explanation: Optional[str] = None

    class Config:
        from_attributes = True


class QuizResponse(BaseModel):
    id: str
    resource_id: str
    chapter_id: Optional[str] = None
    title: str
    description: Optional[str] = None
    questions: List[QuizQuestionResponse] = []

    class Config:
        from_attributes = True


class QuizSubmit(BaseModel):
    answers: dict  # {question_id: answer_str}


class QuizAttemptResponse(BaseModel):
    id: str
    quiz_id: str
    score: float
    total_questions: int
    answers: Any
    completed_at: datetime

    class Config:
        from_attributes = True
