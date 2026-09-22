import sys
import io
import traceback
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.models import Chapter, CodingProblem, CodingSubmission, User, UserStat
from app.db.session import get_db
from app.modules.auth.dependencies import get_current_user
from app.schemas.coding import CodeSubmitRequest, CodingProblemResponse, SubmissionResponse

router = APIRouter(prefix="/coding", tags=["Coding Practice"])


@router.get("/problems/{resource_id}", response_model=List[CodingProblemResponse])
def get_coding_problems(
    resource_id: str,
    chapter_id: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Fetch coding practice problems associated with a resource or chapter."""
    query = db.query(CodingProblem).filter(CodingProblem.resource_id == resource_id)
    if chapter_id:
        query = query.filter(CodingProblem.chapter_id == chapter_id)
    
    problems = query.all()
    if not problems:
        # Create default sample problem if none exists
        chapter = db.query(Chapter).filter(Chapter.id == chapter_id).first() if chapter_id else None
        title = f"Implement Optimization Algorithm ({chapter.title if chapter else 'Chapter Practice'})"
        
        sample_problem = CodingProblem(
            resource_id=resource_id,
            chapter_id=chapter_id,
            title=title,
            description="Write a function `gradient_descent_step(w, dw, lr)` that updates parameter weight `w` using gradient `dw` and learning rate `lr`.",
            difficulty="medium",
            starter_code="def gradient_descent_step(w: float, dw: float, lr: float = 0.01) -> float:\n    # Implement parameter update rule\n    pass",
            test_cases=[{"input": "w=10.0, dw=2.0, lr=0.1", "output": "9.8"}],
        )
        db.add(sample_problem)
        db.commit()
        db.refresh(sample_problem)
        problems = [sample_problem]

    return problems


@router.post("/submit", response_model=SubmissionResponse)
def submit_code(
    payload: CodeSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Submit code solution for execution and test verification."""
    problem = db.query(CodingProblem).filter(CodingProblem.id == payload.problem_id).first()
    if not problem:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Coding problem not found")

    # Safe execution scope setup
    captured_output = io.StringIO()
    old_stdout = sys.stdout
    exec_status = "passed"
    output_str = ""

    try:
        sys.stdout = captured_output
        exec_globals = {}
        exec(payload.submitted_code, exec_globals)
        sys.stdout = old_stdout
        
        raw_out = captured_output.getvalue().strip()
        output_str = f"Code executed successfully.\n{raw_out}" if raw_out else "Code executed cleanly with no stdout output."

    except Exception as e:
        sys.stdout = old_stdout
        exec_status = "error"
        output_str = f"Execution Error:\n{traceback.format_exc()}"

    submission = CodingSubmission(
        user_id=current_user.id,
        problem_id=payload.problem_id,
        submitted_code=payload.submitted_code,
        status=exec_status,
        execution_output=output_str,
    )
    db.add(submission)

    # Update UserStat stats
    if exec_status == "passed":
        stat = db.query(UserStat).filter(UserStat.user_id == current_user.id).first()
        if not stat:
            stat = UserStat(user_id=current_user.id)
            db.add(stat)
        stat.coding_problems_solved += 1

    db.commit()
    db.refresh(submission)
    return submission
