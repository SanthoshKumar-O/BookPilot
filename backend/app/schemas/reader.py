from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel


class ProgressUpdate(BaseModel):
    resource_id: str
    current_chapter_id: Optional[str] = None
    current_page: int
    scroll_position: float = 0.0
    completion_percentage: float = 0.0


class ProgressResponse(BaseModel):
    id: str
    resource_id: str
    current_chapter_id: Optional[str] = None
    current_page: int
    scroll_position: float
    completion_percentage: float
    last_read_at: datetime

    class Config:
        from_attributes = True


class BookmarkCreate(BaseModel):
    resource_id: str
    title: str
    page_number: int
    scroll_position: float = 0.0


class BookmarkResponse(BaseModel):
    id: str
    resource_id: str
    title: str
    page_number: int
    scroll_position: float
    created_at: datetime

    class Config:
        from_attributes = True


class HighlightCreate(BaseModel):
    resource_id: str
    chapter_id: Optional[str] = None
    selected_text: str
    category: str = "important"  # important, definition, formula, code, review
    page_number: int
    color: str = "yellow"


class HighlightResponse(BaseModel):
    id: str
    resource_id: str
    chapter_id: Optional[str] = None
    selected_text: str
    category: str
    page_number: int
    color: str
    created_at: datetime

    class Config:
        from_attributes = True


class NoteCreate(BaseModel):
    resource_id: str
    highlight_id: Optional[str] = None
    content: str
    page_number: int = 1


class NoteResponse(BaseModel):
    id: str
    resource_id: str
    highlight_id: Optional[str] = None
    content: str
    page_number: int
    created_at: datetime

    class Config:
        from_attributes = True
