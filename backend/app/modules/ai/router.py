from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.models import LearningMessage, LearningSession, User
from app.db.session import get_db
from app.modules.ai.rag import generate_rag_response
from app.modules.auth.dependencies import get_current_user
from app.schemas.ai import ChatMessageResponse, ChatQuery, ChatResponse

router = APIRouter(prefix="/ai", tags=["AI Companion"])


@router.post("/chat", response_model=ChatResponse)
def companion_chat(
    payload: ChatQuery,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Interact with the context-aware AI learning companion while reading."""
    # Find or create LearningSession for user & resource
    session = db.query(LearningSession).filter(
        LearningSession.user_id == current_user.id,
        LearningSession.resource_id == payload.resource_id,
    ).first()

    if not session:
        session = LearningSession(
            user_id=current_user.id,
            resource_id=payload.resource_id,
            chapter_id=payload.chapter_id,
            mode=payload.mode,
        )
        db.add(session)
        db.flush()

    # Save user message
    user_msg = LearningMessage(
        session_id=session.id,
        sender="user",
        content=payload.query,
        context_chapter_id=payload.chapter_id,
        context_page=payload.current_page,
    )
    db.add(user_msg)

    # Generate RAG response using location-aware chunks
    rag_result = generate_rag_response(
        db=db,
        resource_id=payload.resource_id,
        query=payload.query,
        chapter_id=payload.chapter_id,
        current_page=payload.current_page,
        mode=payload.mode,
    )

    # Save assistant message
    asst_msg = LearningMessage(
        session_id=session.id,
        sender="assistant",
        content=rag_result["answer"],
        context_chapter_id=payload.chapter_id,
        context_page=payload.current_page,
        retrieved_chunks=rag_result["retrieved_chunks"],
    )
    db.add(asst_msg)

    db.commit()
    db.refresh(user_msg)
    db.refresh(asst_msg)

    return ChatResponse(
        user_message=user_msg,
        assistant_message=asst_msg,
    )


@router.get("/history/{resource_id}", response_model=List[ChatMessageResponse])
def get_chat_history(
    resource_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get chat history for current resource and companion session."""
    session = db.query(LearningSession).filter(
        LearningSession.user_id == current_user.id,
        LearningSession.resource_id == resource_id,
    ).first()

    if not session:
        return []

    return db.query(LearningMessage).filter(LearningMessage.session_id == session.id).order_by(LearningMessage.created_at.asc()).all()
