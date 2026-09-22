from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.models import Bookmark, Highlight, Note, ReadingProgress, ReadingSession, User
from app.db.session import get_db
from app.modules.auth.dependencies import get_current_user
from app.schemas.reader import (
    BookmarkCreate,
    BookmarkResponse,
    HighlightCreate,
    HighlightResponse,
    NoteCreate,
    NoteResponse,
    ProgressResponse,
    ProgressUpdate,
)

router = APIRouter(prefix="/reader", tags=["Reader"])


@router.put("/progress", response_model=ProgressResponse)
def update_reading_progress(
    payload: ProgressUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Save user's current reading position, chapter, scroll, and completion percentage."""
    progress = db.query(ReadingProgress).filter(
        ReadingProgress.user_id == current_user.id,
        ReadingProgress.resource_id == payload.resource_id,
    ).first()

    if not progress:
        progress = ReadingProgress(
            user_id=current_user.id,
            resource_id=payload.resource_id,
        )
        db.add(progress)

    progress.current_chapter_id = payload.current_chapter_id
    progress.current_page = payload.current_page
    progress.scroll_position = payload.scroll_position
    progress.completion_percentage = payload.completion_percentage
    progress.last_read_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(progress)
    return progress


@router.get("/progress/{resource_id}", response_model=ProgressResponse)
def get_reading_progress(
    resource_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get current reading progress for a resource."""
    progress = db.query(ReadingProgress).filter(
        ReadingProgress.user_id == current_user.id,
        ReadingProgress.resource_id == resource_id,
    ).first()
    if not progress:
        # Create initial record if missing
        progress = ReadingProgress(
            user_id=current_user.id,
            resource_id=resource_id,
            current_page=1,
        )
        db.add(progress)
        db.commit()
        db.refresh(progress)
    return progress


@router.post("/bookmarks", response_model=BookmarkResponse, status_code=status.HTTP_201_CREATED)
def create_bookmark(
    payload: BookmarkCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a bookmark at page location."""
    bookmark = Bookmark(
        user_id=current_user.id,
        resource_id=payload.resource_id,
        title=payload.title,
        page_number=payload.page_number,
        scroll_position=payload.scroll_position,
    )
    db.add(bookmark)
    db.commit()
    db.refresh(bookmark)
    return bookmark


@router.get("/bookmarks/{resource_id}", response_model=List[BookmarkResponse])
def get_bookmarks(
    resource_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get user bookmarks for resource."""
    return db.query(Bookmark).filter(
        Bookmark.user_id == current_user.id,
        Bookmark.resource_id == resource_id,
    ).order_by(Bookmark.page_number.asc()).all()


@router.post("/highlights", response_model=HighlightResponse, status_code=status.HTTP_201_CREATED)
def create_highlight(
    payload: HighlightCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create text highlight with category (important, definition, formula, code, review)."""
    highlight = Highlight(
        user_id=current_user.id,
        resource_id=payload.resource_id,
        chapter_id=payload.chapter_id,
        selected_text=payload.selected_text,
        category=payload.category,
        page_number=payload.page_number,
        color=payload.color,
    )
    db.add(highlight)
    db.commit()
    db.refresh(highlight)
    return highlight


@router.get("/highlights/{resource_id}", response_model=List[HighlightResponse])
def get_highlights(
    resource_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get user highlights for resource."""
    return db.query(Highlight).filter(
        Highlight.user_id == current_user.id,
        Highlight.resource_id == resource_id,
    ).order_by(Highlight.page_number.asc()).all()


@router.post("/notes", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
def create_note(
    payload: NoteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create personal note attached to highlight or page."""
    note = Note(
        user_id=current_user.id,
        resource_id=payload.resource_id,
        highlight_id=payload.highlight_id,
        content=payload.content,
        page_number=payload.page_number,
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


@router.get("/notes/{resource_id}", response_model=List[NoteResponse])
def get_notes(
    resource_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get user notes for resource."""
    return db.query(Note).filter(
        Note.user_id == current_user.id,
        Note.resource_id == resource_id,
    ).order_by(Note.page_number.asc()).all()
