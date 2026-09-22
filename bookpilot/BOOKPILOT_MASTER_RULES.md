# BOOKPILOT — MASTER RULES, CONSTRAINTS & QUALITY STANDARD

VERSION: 1.0

PROJECT:
BookPilot

PURPOSE:
BookPilot is an AI-powered learning environment for technical books and learning resources.

The learner can upload or import:
- PDF
- EPUB
- PDF from a URL

BookPilot processes the resource, understands its structure, identifies chapters and concepts, and creates an interactive learning environment around the original material.

The original resource is the source of truth.
The AI does NOT replace the book.
The AI adds a contextual learning layer around the book.

The core learning loop is:
READ → UNDERSTAND → PRACTICE → TEST → CONTINUE

============================================================
01. ABSOLUTE PRODUCT PRINCIPLES
============================================================
1. BookPilot is a reading and learning environment first.
2. BookPilot is NOT: ChatGPT with PDF upload, a generic document viewer, a note-taking application, a traditional LMS, a PDF summarizer, or a generic chatbot.
3. The primary activity is READING.
4. AI must enhance reading rather than dominate it.
5. The original book/resource remains the source of truth.
6. The UI must communicate: "I am reading my technical book and BookPilot understands where I am."
7. Never allow the AI interface to visually overpower the book.
8. Never turn the product into a generic SaaS dashboard.
9. Never turn the product into a flashy AI startup landing page.
10. Never sacrifice reading quality for visual effects.
11. Never add a feature merely because it looks impressive.
12. Every feature must support: reading, understanding, practice, testing, continuing the learning journey.

============================================================
02. INFORMATION HIERARCHY
============================================================
CONTENT → READING EXPERIENCE → LEARNING CONTEXT → AI ASSISTANCE → SECONDARY ANALYTICS

The book content is more important than analytics, AI chat, decorative cards, statistics, or animations.

============================================================
03. CORE LEARNING LOOP
============================================================
Discover Resource → Add Resource → Processing → Open Resource → Read → Understand → Interact with difficult concepts → Continue Reading → Finish Chapter → Take Quiz → Practice Coding → Review → Continue Next Chapter

============================================================
04. VISUAL DIRECTION & DESIGN LANGUAGE
============================================================
- Aesthetic: Calm, technical, focused, modern, premium, intelligent, minimal, information-dense without being overwhelming.
- Avoid: Generic SaaS appearance, excessive gradients, excessive glassmorphism, flashy neon AI aesthetics, giant hero banners, excessive rounded cards, excessive shadows, childish education UI, traditional LMS appearance, visual clutter.
- Colors: Neutral-first palette (warm off-white/light gray backgrounds, near-black primary text, muted grays, subtle borders, single restrained technical accent, restrained semantic success/warning/error colors).
- Themes: Seamless support for Light, Dark, and Sepia.
- Typography: Clear hierarchy, readable paragraph spacing, comfortable line width, monospace for code, math readability.

============================================================
05. APPLICATION ARCHITECTURE & ROUTING
============================================================
- /dashboard: "What should I do next?" (Continue reading dominates).
- /library: Manage resources (Filters, search, resource cards with status/progress).
- /library/:resourceId: Resource overview, learning path, chapters, concepts, notes.
- /reader/:resourceId/:chapterId: 
  - Left: Table of contents / navigation
  - Center: Sacred reading area (headings, code, formulas, text selection toolbar)
  - Right: Contextual AI Companion (understands active book, chapter, and selected excerpt)
- /quizzes & /quizzes/:quizId: Interactive assessments that teach, provide explanations, and pinpoint weak concepts.
- /coding & /coding/:problemId: Developer-focused coding sandbox with runnable test cases.
- /study-plans: "How do I finish this resource?" structured roadmap.
- /progress: Secondary analytics (reading time, streak, mastery, chapters needing review).
- /settings: Reader typography, themes, and preferences.

============================================================
06. REFINEMENT & QUALITY GATE
============================================================
Before concluding any implementation:
BUILD → RUN → INSPECT → CRITIQUE → REFINE → VERIFY
Verify across Functional, Visual, UX, Responsive (Desktop/Tablet/Mobile), Accessibility, and State handling (default, hover, loading, empty, error, processing).
