from datetime import datetime
from typing import Any, List, Optional
from pydantic import BaseModel, HttpUrl


class ResourceCreate(BaseModel):
    title: str
    author: Optional[str] = None
    description: Optional[str] = None


class ResourceURLImport(BaseModel):
    url: str
    title: Optional[str] = None
    author: Optional[str] = None


class ChapterResponse(BaseModel):
    id: str
    chapter_number: int
    title: str
    summary: Optional[str] = None
    start_page: int
    end_page: int
    estimated_reading_minutes: int
    complexity_score: float

    class Config:
        from_attributes = True


class ConceptResponse(BaseModel):
    id: str
    name: str
    description: str
    importance: str
    prerequisites: Optional[Any] = None

    class Config:
        from_attributes = True


class OutlineResponse(BaseModel):
    id: str
    title: str
    level: int
    section_number: Optional[str] = None
    start_page: Optional[int] = None

    class Config:
        from_attributes = True


class ResourceChunkResponse(BaseModel):
    id: str
    chunk_index: int
    content: str
    content_type: str
    page_number: int
    complexity_score: float
    importance_score: float

    class Config:
        from_attributes = True


class ResourceResponse(BaseModel):
    id: str
    title: str
    author: Optional[str] = None
    description: Optional[str] = None
    format: str
    file_path: Optional[str] = None
    source_url: Optional[str] = None
    cover_image_url: Optional[str] = None
    status: str
    total_chapters: int
    total_pages: int
    created_at: datetime

    class Config:
        from_attributes = True


class ResourceDetailResponse(ResourceResponse):
    chapters: List[ChapterResponse] = []
    concepts: List[ConceptResponse] = []
    outlines: List[OutlineResponse] = []
