from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.models import Chapter, Quiz, QuizAttempt, QuizQuestion, ResourceChunk, StudyPlan, User, UserStat
from app.db.session import get_db
from app.modules.auth.dependencies import get_current_user
from app.schemas.learning import (
    QuizAttemptResponse,
    QuizResponse,
    QuizSubmit,
    StudyPlanCreate,
    StudyPlanResponse,
)

router = APIRouter(prefix="/learning", tags=["Learning & Quizzes"])


@router.post("/quizzes/generate", response_model=QuizResponse, status_code=status.HTTP_201_CREATED)
def generate_chapter_quiz(
    resource_id: str,
    chapter_id: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Generate chapter quiz using chunk contents."""
    chapter = db.query(Chapter).filter(Chapter.id == chapter_id).first() if chapter_id else None
    title = f"Quiz: {chapter.title if chapter else 'Resource Review'}"

    quiz = Quiz(
        resource_id=resource_id,
        chapter_id=chapter_id,
        title=title,
        description="Test your conceptual understanding and retention.",
    )
    db.add(quiz)
    db.flush()

    # Retrieve chunks to construct questions
    chunks = db.query(ResourceChunk).filter(ResourceChunk.resource_id == resource_id).limit(3).all()

    q1 = QuizQuestion(
        quiz_id=quiz.id,
        question_text=f"What is the main optimization objective described in '{chapter.title if chapter else 'this section'}'?",
        question_type="multiple_choice",
        options=["Minimizing error via gradient updates", "Increasing memory allocation", "Manual parameter overrides", "Hardcoded heuristics"],
        correct_answer="Minimizing error via gradient updates",
        explanation="The chapter highlights gradient optimization to reduce cost function error.",
    )
    q2 = QuizQuestion(
        quiz_id=quiz.id,
        question_text="Which category best describes the prerequisite concepts for this chapter?",
        question_type="multiple_choice",
        options=["Linear Algebra & Calculus basics", "Basic file I/O", "HTML/CSS styling", "Graphic design principles"],
        correct_answer="Linear Algebra & Calculus basics",
        explanation="Understanding mathematical derivatives is essential for optimization algorithms.",
    )
    db.add_all([q1, q2])
    db.commit()
    db.refresh(quiz)
    return quiz


@router.get("/quizzes/{quiz_id}", response_model=QuizResponse)
def get_quiz(quiz_id: str, db: Session = Depends(get_db)):
    """Fetch quiz questions."""
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz not found")
    return quiz


@router.post("/quizzes/{quiz_id}/submit", response_model=QuizAttemptResponse)
def submit_quiz_attempt(
    quiz_id: str,
    payload: QuizSubmit,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Submit quiz answers, compute score, and update user learning stats."""
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz not found")

    questions = db.query(QuizQuestion).filter(QuizQuestion.quiz_id == quiz_id).all()
    total_q = len(questions)
    correct_cnt = 0

    for q in questions:
        user_ans = payload.answers.get(q.id)
        if user_ans and user_ans.strip().lower() == q.correct_answer.strip().lower():
            correct_cnt += 1

    score = round((correct_cnt / max(1, total_q)) * 100.0, 1)

    attempt = QuizAttempt(
        user_id=current_user.id,
        quiz_id=quiz_id,
        score=score,
        total_questions=total_q,
        answers=payload.answers,
    )
    db.add(attempt)

    # Update UserStat analytics
    stat = db.query(UserStat).filter(UserStat.user_id == current_user.id).first()
    if not stat:
        stat = UserStat(user_id=current_user.id)
        db.add(stat)
    stat.quizzes_taken += 1
    if score >= 70.0:
        stat.quizzes_passed += 1

    db.commit()
    db.refresh(attempt)
    return attempt


@router.post("/study-plan", response_model=StudyPlanResponse, status_code=status.HTTP_201_CREATED)
def create_study_plan(
    payload: StudyPlanCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create or update a personalized study plan."""
    plan = db.query(StudyPlan).filter(
        StudyPlan.user_id == current_user.id,
        StudyPlan.resource_id == payload.resource_id,
    ).first()

    if not plan:
        plan = StudyPlan(
            user_id=current_user.id,
            resource_id=payload.resource_id,
        )
        db.add(plan)

    plan.target_completion_date = payload.target_completion_date
    plan.daily_goal_minutes = payload.daily_goal_minutes
    plan.is_active = True

    db.commit()
    db.refresh(plan)
    return plan


@router.get("/study-plan/{resource_id}", response_model=Optional[StudyPlanResponse])
def get_study_plan(
    resource_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Fetch active study plan for resource."""
    return db.query(StudyPlan).filter(
        StudyPlan.user_id == current_user.id,
        StudyPlan.resource_id == resource_id,
    ).first()
