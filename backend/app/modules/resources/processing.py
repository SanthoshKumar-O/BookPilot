import math
import re
from typing import Dict, List, Tuple
from sqlalchemy.orm import Session

from app.db.models import Chapter, Concept, Resource, ResourceChunk, ResourceOutline


def process_resource_content(db: Session, resource_id: str, raw_text: str, total_pages: int = 1) -> Resource:
    """Process resource raw text into chapters, outlines, concepts, chunks, complexity scores, and vector embeddings."""
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        raise ValueError(f"Resource {resource_id} not found")

    resource.status = "extracting"
    db.commit()

    # 1. Structure Detection & Chapter Segmentation
    chapters_data = _detect_chapters(raw_text, total_pages)
    
    # 2. Persist Outlines & Chapters
    created_chapters = []
    for idx, chap_info in enumerate(chapters_data, start=1):
        outline = ResourceOutline(
            resource_id=resource.id,
            title=chap_info["title"],
            level=2,
            section_number=f"Chapter {idx}",
            start_page=chap_info["start_page"],
            order_index=idx,
        )
        db.add(outline)

        chapter = Chapter(
            resource_id=resource.id,
            chapter_number=idx,
            title=chap_info["title"],
            summary=chap_info.get("summary", f"Overview of {chap_info['title']}"),
            start_page=chap_info["start_page"],
            end_page=chap_info["end_page"],
            estimated_reading_minutes=max(5, math.ceil(len(chap_info["text"].split()) / 200)),
            complexity_score=_calculate_text_complexity(chap_info["text"]),
        )
        db.add(chapter)
        db.flush()
        created_chapters.append((chapter, chap_info["text"]))

    # 3. Chunking & Content Analysis per Chapter
    resource.status = "chunking"
    db.commit()

    total_chunks = 0
    for chapter, chap_text in created_chapters:
        paragraphs = [p.strip() for p in chap_text.split("\n\n") if p.strip()]
        if not paragraphs:
            paragraphs = [chap_text]

        chunk_index = 0
        for para in paragraphs:
            chunk_index += 1
            total_chunks += 1
            content_type = _detect_content_type(para)
            comp_score = _calculate_text_complexity(para)
            imp_score = _calculate_importance_score(para, content_type)

            # Compute pseudo vector embedding (384-dimensional unit normalized vector representation)
            dummy_embedding = _generate_embedding(para)

            chunk = ResourceChunk(
                resource_id=resource.id,
                chapter_id=chapter.id,
                chunk_index=chunk_index,
                content=para,
                content_type=content_type,
                page_number=chapter.start_page,
                complexity_score=comp_score,
                importance_score=imp_score,
                embedding=dummy_embedding,
            )
            db.add(chunk)

        # 4. Extract Key Concepts for Chapter
        concepts = _extract_concepts(chap_text)
        for concept_name, concept_desc, importance in concepts:
            concept = Concept(
                resource_id=resource.id,
                chapter_id=chapter.id,
                name=concept_name,
                description=concept_desc,
                importance=importance,
                prerequisites=[],
            )
            db.add(concept)

    resource.total_chapters = len(created_chapters)
    resource.total_pages = total_pages
    resource.status = "ready"
    db.commit()
    db.refresh(resource)
    return resource


def _detect_chapters(raw_text: str, total_pages: int) -> List[Dict]:
    """Segment raw text into structured chapter blocks."""
    lines = raw_text.split("\n")
    chapter_pattern = re.compile(r"^(chapter\s+\d+|part\s+\d+|\d+\.\s+[A-Z])", re.IGNORECASE)

    chapters = []
    current_title = "Chapter 1: Introduction"
    current_lines = []
    current_start_page = 1

    for line in lines:
        if chapter_pattern.match(line.strip()):
            if current_lines:
                chapters.append({
                    "title": current_title,
                    "text": "\n".join(current_lines),
                    "start_page": current_start_page,
                    "end_page": min(total_pages, current_start_page + max(1, len(current_lines) // 50)),
                })
                current_start_page = min(total_pages, current_start_page + max(1, len(current_lines) // 50))
            current_title = line.strip()
            current_lines = []
        else:
            current_lines.append(line)

    if current_lines or not chapters:
        chapters.append({
            "title": current_title if chapters else "Chapter 1: Core Concepts",
            "text": "\n".join(current_lines) if current_lines else raw_text,
            "start_page": current_start_page,
            "end_page": total_pages,
        })

    return chapters


def _detect_content_type(text: str) -> str:
    """Classify chunk as text, code, formula, or definition."""
    if re.search(r"(def\s+\w+|class\s+\w+|import\s+\w+|const\s+\w+|let\s+\w+|return\s+)", text):
        return "code"
    if re.search(r"(\=|\+|\-|\*|\/|\^|\∑|\∫|\√|\{|\}|\(|\))", text) and len(re.findall(r"\d", text)) > 2:
        return "formula"
    if re.search(r"\b(is defined as|refers to|denotes|is a type of|is an algorithm)\b", text, re.IGNORECASE):
        return "definition"
    return "text"


def _calculate_text_complexity(text: str) -> float:
    """Compute complexity score (0.0 to 10.0) based on average word length & sentence length."""
    words = text.split()
    if not words:
        return 2.0
    avg_word_len = sum(len(w) for w in words) / len(words)
    sentences = re.split(r"[.!?]", text)
    avg_sent_len = len(words) / max(1, len(sentences))

    raw_score = (avg_word_len * 0.8) + (avg_sent_len * 0.15)
    return round(min(10.0, max(1.0, raw_score)), 1)


def _calculate_importance_score(text: str, content_type: str) -> float:
    """Calculate importance score (0.0 to 10.0)."""
    score = 5.0
    if content_type in ("code", "definition", "formula"):
        score += 2.5
    if re.search(r"\b(important|crucial|key|fundamental|note|remember|must|core)\b", text, re.IGNORECASE):
        score += 2.0
    return round(min(10.0, score), 1)


def _extract_concepts(text: str) -> List[Tuple[str, str, str]]:
    """Extract key technical concepts from chapter text."""
    concepts = []
    # Match capitalized technical phrases
    matches = re.findall(r"\b([A-Z][a-zA-Z0-9_\s]{3,30})\b", text)
    unique_names = list(dict.fromkeys(matches))[:5]
    for name in unique_names:
        name_clean = name.strip()
        if len(name_clean) > 3:
            concepts.append((
                name_clean,
                f"Core concept '{name_clean}' discussed in chapter.",
                "key",
            ))
    if not concepts:
        concepts.append(("Core Concept", "Key idea presented in this chapter.", "key"))
    return concepts


def _generate_embedding(text: str) -> List[float]:
    """Generate normalized pseudo 384-d float vector embedding from text hash."""
    import hashlib
    seed_hash = hashlib.sha256(text.encode("utf-8")).digest()
    raw_vector = [((seed_hash[i % 32] + i * 7) % 255) / 255.0 for i in range(384)]
    norm = math.sqrt(sum(v * v for v in raw_vector))
    return [round(v / norm, 4) for v in raw_vector]
