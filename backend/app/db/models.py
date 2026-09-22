import uuid
from datetime import datetime, timezone
from typing import Any, List, Optional
from sqlalchemy import JSON, Boolean, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


# ----------------------------------------------------------------------
# Core User & Auth
# ----------------------------------------------------------------------
class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False)

    resources: Mapped[List["Resource"]] = relationship("Resource", back_populates="owner", cascade="all, delete-orphan")
    reading_progress: Mapped[List["ReadingProgress"]] = relationship("ReadingProgress", back_populates="user", cascade="all, delete-orphan")
    stats: Mapped[Optional["UserStat"]] = relationship("UserStat", back_populates="user", uselist=False, cascade="all, delete-orphan")


# ----------------------------------------------------------------------
# Resources & Processing Pipeline
# ----------------------------------------------------------------------
class Resource(Base):
    __tablename__ = "resources"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    author: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    format: Mapped[str] = mapped_column(String(20), nullable=False)  # pdf, epub, url
    file_path: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    source_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    cover_image_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="pending")  # pending, extracting, chunking, embedding, ready, error
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    total_chapters: Mapped[int] = mapped_column(Integer, default=0)
    total_pages: Mapped[int] = mapped_column(Integer, default=0)
    owner_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    owner: Mapped["User"] = relationship("User", back_populates="resources")
    outlines: Mapped[List["ResourceOutline"]] = relationship("ResourceOutline", back_populates="resource", cascade="all, delete-orphan")
    chapters: Mapped[List["Chapter"]] = relationship("Chapter", back_populates="resource", cascade="all, delete-orphan")
    concepts: Mapped[List["Concept"]] = relationship("Concept", back_populates="resource", cascade="all, delete-orphan")
    chunks: Mapped[List["ResourceChunk"]] = relationship("ResourceChunk", back_populates="resource", cascade="all, delete-orphan")


class ResourceOutline(Base):
    __tablename__ = "resource_outlines"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    resource_id: Mapped[str] = mapped_column(String(36), ForeignKey("resources.id", ondelete="CASCADE"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    level: Mapped[int] = mapped_column(Integer, default=1)  # 1=Part, 2=Chapter, 3=Section
    section_number: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    start_page: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    parent_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("resource_outlines.id", ondelete="CASCADE"), nullable=True)
    order_index: Mapped[int] = mapped_column(Integer, default=0)

    resource: Mapped["Resource"] = relationship("Resource", back_populates="outlines")


class Chapter(Base):
    __tablename__ = "chapters"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    resource_id: Mapped[str] = mapped_column(String(36), ForeignKey("resources.id", ondelete="CASCADE"), nullable=False)
    chapter_number: Mapped[int] = mapped_column(Integer, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    start_page: Mapped[int] = mapped_column(Integer, default=1)
    end_page: Mapped[int] = mapped_column(Integer, default=1)
    estimated_reading_minutes: Mapped[int] = mapped_column(Integer, default=0)
    complexity_score: Mapped[float] = mapped_column(Float, default=0.0)

    resource: Mapped["Resource"] = relationship("Resource", back_populates="chapters")
    concepts: Mapped[List["Concept"]] = relationship("Concept", back_populates="chapter", cascade="all, delete-orphan")
    chunks: Mapped[List["ResourceChunk"]] = relationship("ResourceChunk", back_populates="chapter", cascade="all, delete-orphan")


class Concept(Base):
    __tablename__ = "concepts"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    resource_id: Mapped[str] = mapped_column(String(36), ForeignKey("resources.id", ondelete="CASCADE"), nullable=False)
    chapter_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("chapters.id", ondelete="SET NULL"), nullable=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    importance: Mapped[str] = mapped_column(String(50), default="key")  # key, prerequisite, advanced
    prerequisites: Mapped[Optional[Any]] = mapped_column(JSON, nullable=True)  # List of concept IDs/names

    resource: Mapped["Resource"] = relationship("Resource", back_populates="concepts")
    chapter: Mapped[Optional["Chapter"]] = relationship("Chapter", back_populates="concepts")


class ResourceChunk(Base):
    __tablename__ = "resource_chunks"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    resource_id: Mapped[str] = mapped_column(String(36), ForeignKey("resources.id", ondelete="CASCADE"), nullable=False)
    chapter_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("chapters.id", ondelete="SET NULL"), nullable=True)
    chunk_index: Mapped[int] = mapped_column(Integer, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    content_type: Mapped[str] = mapped_column(String(50), default="text")  # text, code, formula, definition
    page_number: Mapped[int] = mapped_column(Integer, default=1)
    complexity_score: Mapped[float] = mapped_column(Float, default=0.0)
    importance_score: Mapped[float] = mapped_column(Float, default=0.0)
    embedding: Mapped[Optional[Any]] = mapped_column(JSON, nullable=True)  # List of floats vector embedding

    resource: Mapped["Resource"] = relationship("Resource", back_populates="chunks")
    chapter: Mapped[Optional["Chapter"]] = relationship("Chapter", back_populates="chunks")


# ----------------------------------------------------------------------
# Reading & Notes
# ----------------------------------------------------------------------
class ReadingProgress(Base):
    __tablename__ = "reading_progress"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    resource_id: Mapped[str] = mapped_column(String(36), ForeignKey("resources.id", ondelete="CASCADE"), nullable=False)
    current_chapter_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("chapters.id", ondelete="SET NULL"), nullable=True)
    current_page: Mapped[int] = mapped_column(Integer, default=1)
    scroll_position: Mapped[float] = mapped_column(Float, default=0.0)
    completion_percentage: Mapped[float] = mapped_column(Float, default=0.0)
    last_read_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user: Mapped["User"] = relationship("User", back_populates="reading_progress")


class ReadingSession(Base):
    __tablename__ = "reading_sessions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    resource_id: Mapped[str] = mapped_column(String(36), ForeignKey("resources.id", ondelete="CASCADE"), nullable=False)
    start_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    end_time: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    duration_seconds: Mapped[int] = mapped_column(Integer, default=0)
    pages_read: Mapped[int] = mapped_column(Integer, default=0)


class Bookmark(Base):
    __tablename__ = "bookmarks"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    resource_id: Mapped[str] = mapped_column(String(36), ForeignKey("resources.id", ondelete="CASCADE"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    page_number: Mapped[int] = mapped_column(Integer, nullable=False)
    scroll_position: Mapped[float] = mapped_column(Float, default=0.0)


class Highlight(Base):
    __tablename__ = "highlights"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    resource_id: Mapped[str] = mapped_column(String(36), ForeignKey("resources.id", ondelete="CASCADE"), nullable=False)
    chapter_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("chapters.id", ondelete="SET NULL"), nullable=True)
    selected_text: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(50), default="important")  # important, definition, formula, code, review
    page_number: Mapped[int] = mapped_column(Integer, nullable=False)
    color: Mapped[str] = mapped_column(String(20), default="yellow")

    notes: Mapped[List["Note"]] = relationship("Note", back_populates="highlight", cascade="all, delete-orphan")


class Note(Base):
    __tablename__ = "notes"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    resource_id: Mapped[str] = mapped_column(String(36), ForeignKey("resources.id", ondelete="CASCADE"), nullable=False)
    highlight_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("highlights.id", ondelete="CASCADE"), nullable=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    page_number: Mapped[int] = mapped_column(Integer, default=1)

    highlight: Mapped[Optional["Highlight"]] = relationship("Highlight", back_populates="notes")


# ----------------------------------------------------------------------
# Learning Companion & RAG Session
# ----------------------------------------------------------------------
class LearningSession(Base):
    __tablename__ = "learning_sessions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    resource_id: Mapped[str] = mapped_column(String(36), ForeignKey("resources.id", ondelete="CASCADE"), nullable=False)
    chapter_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("chapters.id", ondelete="SET NULL"), nullable=True)
    mode: Mapped[str] = mapped_column(String(50), default="tutor")  # plain, tutor, express

    messages: Mapped[List["LearningMessage"]] = relationship("LearningMessage", back_populates="session", cascade="all, delete-orphan")


class LearningMessage(Base):
    __tablename__ = "learning_messages"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    session_id: Mapped[str] = mapped_column(String(36), ForeignKey("learning_sessions.id", ondelete="CASCADE"), nullable=False)
    sender: Mapped[str] = mapped_column(String(20), nullable=False)  # user, assistant
    content: Mapped[str] = mapped_column(Text, nullable=False)
    context_chapter_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    context_page: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    retrieved_chunks: Mapped[Optional[Any]] = mapped_column(JSON, nullable=True)

    session: Mapped["LearningSession"] = relationship("LearningSession", back_populates="messages")


# ----------------------------------------------------------------------
# Study Planning & Quizzes
# ----------------------------------------------------------------------
class StudyPlan(Base):
    __tablename__ = "study_plans"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    resource_id: Mapped[str] = mapped_column(String(36), ForeignKey("resources.id", ondelete="CASCADE"), nullable=False)
    target_completion_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    daily_goal_minutes: Mapped[int] = mapped_column(Integer, default=30)
    current_streak_days: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class Quiz(Base):
    __tablename__ = "quizzes"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    resource_id: Mapped[str] = mapped_column(String(36), ForeignKey("resources.id", ondelete="CASCADE"), nullable=False)
    chapter_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("chapters.id", ondelete="CASCADE"), nullable=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    questions: Mapped[List["QuizQuestion"]] = relationship("QuizQuestion", back_populates="quiz", cascade="all, delete-orphan")


class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    quiz_id: Mapped[str] = mapped_column(String(36), ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    question_text: Mapped[str] = mapped_column(Text, nullable=False)
    question_type: Mapped[str] = mapped_column(String(50), default="multiple_choice")  # multiple_choice, true_false, short_answer
    options: Mapped[Optional[Any]] = mapped_column(JSON, nullable=True)  # List of string options
    correct_answer: Mapped[str] = mapped_column(Text, nullable=False)
    explanation: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    quiz: Mapped["Quiz"] = relationship("Quiz", back_populates="questions")


class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    quiz_id: Mapped[str] = mapped_column(String(36), ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    score: Mapped[float] = mapped_column(Float, nullable=False)
    total_questions: Mapped[int] = mapped_column(Integer, nullable=False)
    answers: Mapped[Optional[Any]] = mapped_column(JSON, nullable=True)
    completed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


# ----------------------------------------------------------------------
# Coding Practice Engine
# ----------------------------------------------------------------------
class CodingProblem(Base):
    __tablename__ = "coding_problems"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    resource_id: Mapped[str] = mapped_column(String(36), ForeignKey("resources.id", ondelete="CASCADE"), nullable=False)
    chapter_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("chapters.id", ondelete="CASCADE"), nullable=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    difficulty: Mapped[str] = mapped_column(String(20), default="medium")  # easy, medium, hard
    starter_code: Mapped[str] = mapped_column(Text, nullable=False)
    test_cases: Mapped[Optional[Any]] = mapped_column(JSON, nullable=True)  # List of {input: ..., output: ...}


class CodingSubmission(Base):
    __tablename__ = "coding_submissions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    problem_id: Mapped[str] = mapped_column(String(36), ForeignKey("coding_problems.id", ondelete="CASCADE"), nullable=False)
    submitted_code: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="passed")  # passed, failed, error
    execution_output: Mapped[Optional[str]] = mapped_column(Text, nullable=True)


# ----------------------------------------------------------------------
# Contextual Recommendations & Analytics
# ----------------------------------------------------------------------
class RecommendedResource(Base):
    __tablename__ = "recommended_resources"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    resource_id: Mapped[str] = mapped_column(String(36), ForeignKey("resources.id", ondelete="CASCADE"), nullable=False)
    concept_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("concepts.id", ondelete="SET NULL"), nullable=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    url: Mapped[str] = mapped_column(String(512), nullable=False)
    type: Mapped[str] = mapped_column(String(50), default="article")  # article, video, tool, paper
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)


class UserStat(Base):
    __tablename__ = "user_stats"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    resources_completed: Mapped[int] = mapped_column(Integer, default=0)
    chapters_completed: Mapped[int] = mapped_column(Integer, default=0)
    total_reading_seconds: Mapped[int] = mapped_column(Integer, default=0)
    quizzes_taken: Mapped[int] = mapped_column(Integer, default=0)
    quizzes_passed: Mapped[int] = mapped_column(Integer, default=0)
    coding_problems_solved: Mapped[int] = mapped_column(Integer, default=0)
    current_streak: Mapped[int] = mapped_column(Integer, default=0)

    user: Mapped["User"] = relationship("User", back_populates="stats")
