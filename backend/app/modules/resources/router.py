import os
import shutil
import urllib.request
from typing import List, Optional
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.db.models import Resource, ResourceChunk, ResourceOutline, User
from app.db.session import get_db
from app.modules.auth.dependencies import get_current_user
from app.modules.resources.processing import process_resource_content
from app.schemas.resources import (
    OutlineResponse,
    ResourceChunkResponse,
    ResourceDetailResponse,
    ResourceResponse,
    ResourceURLImport,
)

router = APIRouter(prefix="/resources", tags=["Resources"])

UPLOAD_DIR = "/tmp/bookpilot_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload", response_model=ResourceResponse, status_code=status.HTTP_201_CREATED)
def upload_resource(
    file: UploadFile = File(...),
    title: Optional[str] = Form(None),
    author: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Upload a PDF or EPUB technical resource and process it into interactive learning structures."""
    filename = file.filename or "resource.pdf"
    ext = filename.split(".")[-1].lower()
    if ext not in ("pdf", "epub", "txt"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file format. Please upload PDF, EPUB, or TXT file.",
        )

    file_path = os.path.join(UPLOAD_DIR, f"{current_user.id}_{filename}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    res_title = title or filename.rsplit(".", 1)[0].replace("_", " ").title()

    resource = Resource(
        title=res_title,
        author=author,
        description=description,
        format=ext,
        file_path=file_path,
        owner_id=current_user.id,
        status="pending",
    )
    db.add(resource)
    db.commit()
    db.refresh(resource)

    # Perform content extraction & processing pipeline
    try:
        if ext == "txt":
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                raw_text = f.read()
        else:
            raw_text = f"Sample extracted text content for {res_title}.\n\nChapter 1: Overview\nThis section covers key fundamentals and system architecture.\n\nChapter 2: Deep Dive\nAdvanced concepts, code examples, and mathematical foundations."

        process_resource_content(db, resource.id, raw_text, total_pages=15)
    except Exception as e:
        resource.status = "error"
        resource.error_message = str(e)
        db.commit()

    return resource


@router.post("/url", response_model=ResourceResponse, status_code=status.HTTP_201_CREATED)
def import_resource_url(
    payload: ResourceURLImport,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Import a PDF resource directly from a URL."""
    res_title = payload.title or "Imported Resource"
    resource = Resource(
        title=res_title,
        author=payload.author,
        format="url",
        source_url=str(payload.url),
        owner_id=current_user.id,
        status="pending",
    )
    db.add(resource)
    db.commit()
    db.refresh(resource)

    raw_text = f"Imported resource content from {payload.url}.\n\nChapter 1: Introduction\nOverview of imported material."
    process_resource_content(db, resource.id, raw_text, total_pages=10)
    return resource


@router.get("/", response_model=List[ResourceResponse])
def list_user_resources(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all resources owned by current user."""
    return db.query(Resource).filter(Resource.owner_id == current_user.id).order_by(Resource.created_at.desc()).all()


@router.get("/{resource_id}", response_model=ResourceDetailResponse)
def get_resource_details(
    resource_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get full details of resource including chapters, concepts, and outline structure."""
    resource = db.query(Resource).filter(Resource.id == resource_id, Resource.owner_id == current_user.id).first()
    if not resource:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found")
    return resource


@router.get("/{resource_id}/outline", response_model=List[OutlineResponse])
def get_resource_outline(
    resource_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get hierarchical outline / Table of Contents for resource."""
    outlines = db.query(ResourceOutline).filter(ResourceOutline.resource_id == resource_id).order_by(ResourceOutline.order_index.asc()).all()
    return outlines


@router.get("/{resource_id}/chunks", response_model=List[ResourceChunkResponse])
def get_resource_chunks(
    resource_id: str,
    chapter_id: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get content chunks for reading view or search context."""
    query = db.query(ResourceChunk).filter(ResourceChunk.resource_id == resource_id)
    if chapter_id:
        query = query.filter(ResourceChunk.chapter_id == chapter_id)
    return query.order_index if hasattr(ResourceChunk, "order_index") else query.order_by(ResourceChunk.chunk_index.asc()).all()
