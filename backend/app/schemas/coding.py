from datetime import datetime
from typing import Any, List, Optional
from pydantic import BaseModel


class CodingProblemResponse(BaseModel):
    id: str
    resource_id: str
    chapter_id: Optional[str] = None
    title: str
    description: str
    difficulty: str
    starter_code: str
    test_cases: Optional[Any] = None

    class Config:
        from_attributes = True


class CodeSubmitRequest(BaseModel):
    problem_id: str
    submitted_code: str


class SubmissionResponse(BaseModel):
    id: str
    problem_id: str
    submitted_code: str
    status: str
    execution_output: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
