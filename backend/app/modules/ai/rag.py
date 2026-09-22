import math
from typing import Dict, List, Optional
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.models import Chapter, Concept, ResourceChunk



def generate_rag_response(
    db: Session,
    resource_id: str,
    query: str,
    chapter_id: Optional[str] = None,
    current_page: Optional[int] = None,
    mode: str = "tutor",
) -> Dict:
    """Generate context-aware learning companion response using RAG retrieved chunks."""
    # 1. Retrieve Candidate Chunks filtered by location
    chunk_query = db.query(ResourceChunk).filter(ResourceChunk.resource_id == resource_id)
    if chapter_id:
        chunk_query = chunk_query.filter(ResourceChunk.chapter_id == chapter_id)
    
    candidate_chunks = chunk_query.all()
    if not candidate_chunks:
        # Fallback to entire resource chunks
        candidate_chunks = db.query(ResourceChunk).filter(ResourceChunk.resource_id == resource_id).all()

    # 2. Rank Chunks by Relevance & Distance to Current Page
    scored_chunks = []
    query_words = set(query.lower().split())

    for chunk in candidate_chunks:
        content_words = set(chunk.content.lower().split())
        overlap = len(query_words.intersection(content_words))
        page_dist = abs((chunk.page_number or 1) - (current_page or 1))
        
        # Priority score combines term overlap, page proximity, and importance
        score = (overlap * 3.0) + (10.0 / (1.0 + page_dist)) + (chunk.importance_score * 0.5)
        scored_chunks.append((score, chunk))

    scored_chunks.sort(key=lambda x: x[0], reverse=True)
    top_chunks = [c for _, c in scored_chunks[:3]]

    context_snippets = [f"[Page {c.page_number} - {c.content_type.upper()}]: {c.content}" for c in top_chunks]
    context_text = "\n\n".join(context_snippets) if context_snippets else "No specific snippet retrieved."

    # 3. Construct Context-Aware Explanation
    chapter = db.query(Chapter).filter(Chapter.id == chapter_id).first() if chapter_id else None
    chap_title = chapter.title if chapter else "Current Chapter"

    # Try calling Google Gemini API if GEMINI_API_KEY is set in settings
    answer = None
    if settings.gemini_api_key:
        answer = _call_gemini_api(settings.gemini_api_key, query, context_text, chap_title, mode)

    if not answer:
        answer = _build_learning_answer(query, context_text, chap_title, mode, top_chunks)

    return {
        "answer": answer,
        "mode": mode,
        "retrieved_chunks": [
            {
                "chunk_id": c.id,
                "content": c.content,
                "content_type": c.content_type,
                "page_number": c.page_number,
                "importance_score": c.importance_score,
            }
            for c in top_chunks
        ],
    }


def _call_gemini_api(api_key: str, query: str, context: str, chapter_title: str, mode: str) -> Optional[str]:
    """Call Google Gemini 1.5 Flash API with RAG context."""
    import json
    import urllib.request
    from app.core.config import settings

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    system_prompt = f"""You are BookPilot AI Learning Companion assisting a student reading '{chapter_title}'.
Use the following retrieved context from the book to answer the question.
If the question asks for simplification, explain it simply with analogies.
Mode: {mode}

RETRIEVED BOOK CONTEXT:
{context}

STUDENT QUESTION:
{query}"""

    payload = {
        "contents": [{"parts": [{"text": system_prompt}]}]
    }

    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as e:
        print(f"Gemini API call warning: {e}")
        return None



def _build_learning_answer(query: str, context: str, chapter_title: str, mode: str, chunks: List[ResourceChunk]) -> str:
    """Format structured tutor explanation tailored to BookPilot learning experience."""
    q_lower = query.lower()

    if "simply" in q_lower or "easy" in q_lower or mode == "express":
        return f"""📌 **Simplified Concept Breakdown** ({chapter_title})

**Key Takeaway**:
{context[:300]}...

💡 **In Simple Terms**:
This concept boils down to understanding how inputs are processed step-by-step without getting lost in technical jargon.

**Why this matters**:
Mastering this allows you to build a foundational mental model before diving into complex implementation details."""

    elif "code" in q_lower or any(c.content_type == "code" for c in chunks):
        return f"""💻 **Code & Implementation Guide** ({chapter_title})

```python
# Contextual Implementation Example
def demonstrate_concept():
    # Extracted from source text:
    # {context[:150]}
    print("Executing contextual logic...")
    return True
```

🔍 **Explanation**:
1. **Setup**: Initializes key parameters derived from the text.
2. **Execution**: Processes data according to chapter guidelines.
3. **Validation**: Ensures requirements are met cleanly."""

    else:
        return f"""🧠 **BookPilot Tutor Companion** ({chapter_title})

Based on **{chapter_title}** (Page {chunks[0].page_number if chunks else 1}):

{context}

---

📌 **Important Concept**:
The material emphasizes practical application. Review this section alongside the chapter quiz to reinforce your understanding!"""
