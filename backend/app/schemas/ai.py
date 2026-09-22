from datetime import datetime
from typing import Any, List, Optional
from pydantic import BaseModel


class ChatQuery(BaseModel):
    resource_id: str
    chapter_id: Optional[str] = None
    current_page: Optional[int] = None
    query: str
    mode: str = "tutor"  # tutor, plain, express


class ChatMessageResponse(BaseModel):
    id: str
    sender: str
    content: str
    context_chapter_id: Optional[str] = None
    context_page: Optional[int] = None
    retrieved_chunks: Optional[Any] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ChatResponse(BaseModel):
    user_message: ChatMessageResponse
    assistant_message: ChatMessageResponse
