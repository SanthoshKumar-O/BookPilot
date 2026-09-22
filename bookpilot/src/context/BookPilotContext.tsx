import React, { useState, useEffect } from 'react';
import { generateId } from '../lib/id';
import type {
  Resource,
  Chapter,
  Concept,
  Highlight,
  Note,
  Bookmark,
  Quiz,
  QuizResult,
  CodingProblem,
  CodeSubmissionResult,
  StudyPlan,
  LearningActivity,
  ProgressAnalytics,
  AISession,
  AIMessage,
  ReaderSettings
} from '../types';
import {
  MOCK_RESOURCES,
  MOCK_CHAPTERS,
  MOCK_CONCEPTS,
  MOCK_HIGHLIGHTS,
  MOCK_NOTES,
  MOCK_BOOKMARKS,
  MOCK_QUIZZES,
  MOCK_CODING_PROBLEMS,
  MOCK_STUDY_PLAN,
  MOCK_ACTIVITIES,
  MOCK_ANALYTICS,
  MOCK_AI_SESSIONS
} from '../data/mockData';
import { BookPilotContext, type SelectionContextState } from './BookPilotContextCore';

export const BookPilotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resources, setResources] = useState<Resource[]>(MOCK_RESOURCES);
  const [activeResourceId, setActiveResourceId] = useState<string>('res-ml-python');
  const [chapters, setChapters] = useState<Record<string, Chapter[]>>(MOCK_CHAPTERS);
  const [activeChapterId, setActiveChapterId] = useState<string>('ch-3');
  const [activeSectionId, setActiveSectionId] = useState<string>('sec-3-2');
  
  const [concepts] = useState<Concept[]>(MOCK_CONCEPTS);
  const [highlights, setHighlights] = useState<Highlight[]>(MOCK_HIGHLIGHTS);
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(MOCK_BOOKMARKS);

  const [quizzes] = useState<Quiz[]>(MOCK_QUIZZES);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [codingProblems, setCodingProblems] = useState<CodingProblem[]>(MOCK_CODING_PROBLEMS);
  const [studyPlan, setStudyPlan] = useState<StudyPlan>(MOCK_STUDY_PLAN);
  const [activities, setActivities] = useState<LearningActivity[]>(MOCK_ACTIVITIES);
  const [analytics, setAnalytics] = useState<ProgressAnalytics>(MOCK_ANALYTICS);

  const [aiSessions, setAiSessions] = useState<Record<string, AISession[]>>(MOCK_AI_SESSIONS);
  const [activeAiSessionId, setActiveAiSessionId] = useState<string | null>('session-1');

  const [selectionContext, setSelectionContext] = useState<SelectionContextState | null>(null);
  const [globalSearchOpen, setGlobalSearchOpen] = useState<boolean>(false);

  const [readerSettings, setReaderSettings] = useState<ReaderSettings>({
    fontSize: 18,
    lineWidth: 'comfortable',
    theme: 'light',
    readingMode: 'continuous',
    focusMode: false
  });

  // Apply theme class to document
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.removeAttribute('data-theme');
    if (readerSettings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (readerSettings.theme === 'sepia') {
      document.documentElement.setAttribute('data-theme', 'sepia');
    }
  }, [readerSettings.theme]);

  const activeResource = resources.find((r) => r.id === activeResourceId) || resources[0];
  const resourceChapters = (activeResource && chapters[activeResource.id]) || [];
  const activeChapter = resourceChapters.find((c) => c.id === activeChapterId) || resourceChapters[0];
  const activeSection = activeChapter?.sections.find((s) => s.id === activeSectionId) || activeChapter?.sections[0];

  const addResource = (newRes: Partial<Resource>): Resource => {
    const created: Resource = {
      id: generateId('res'),
      title: newRes.title || 'Untitled Technical Resource',
      author: newRes.author || 'Unknown Author',
      type: newRes.type || 'pdf',
      status: 'processing',
      totalPages: 100,
      totalChapters: 5,
      completedChapters: 0,
      progress: 0,
      currentChapterId: 'ch-1',
      currentSectionId: 'sec-1-1',
      lastOpenedAt: 'Just now',
      description: newRes.description || 'Imported learning resource.',
      tags: newRes.tags || ['Technical'],
      estimatedRemainingMinutes: 120,
      totalReadingMinutes: 0,
      quizAverageScore: 0,
      processingSteps: [
        { id: '1', name: 'Upload complete', status: 'completed', description: 'File uploaded' },
        { id: '2', name: 'Extracting content', status: 'in_progress', description: 'Extracting text and AST...' },
        { id: '3', name: 'Detecting chapters', status: 'pending', description: 'Waiting...' },
        { id: '4', name: 'Analyzing concepts', status: 'pending', description: 'Waiting...' },
        { id: '5', name: 'Creating searchable knowledge', status: 'pending', description: 'Waiting...' },
        { id: '6', name: 'Finalizing reader', status: 'pending', description: 'Waiting...' }
      ],
      ...newRes
    };
    setResources((prev) => [created, ...prev]);
    return created;
  };

  const completeChapter = (resourceId: string, chapterId: string) => {
    setChapters((prev) => {
      const list = prev[resourceId] || [];
      const updated = list.map((ch) =>
        ch.id === chapterId ? { ...ch, isCompleted: true, progress: 100 } : ch
      );
      return { ...prev, [resourceId]: updated };
    });

    setResources((prev) =>
      prev.map((r) => {
        if (r.id === resourceId) {
          const completedCount = (chapters[resourceId] || []).filter((c) => c.isCompleted || c.id === chapterId).length;
          const progressPct = Math.round((completedCount / r.totalChapters) * 100);
          return { ...r, completedChapters: completedCount, progress: progressPct };
        }
        return r;
      })
    );

    addActivity({
      type: 'reading',
      title: `Finished Chapter: ${activeChapter?.title || chapterId}`,
      description: 'Marked chapter as complete',
      resourceId,
      resourceTitle: activeResource?.title
    });
  };

  const addHighlight = (hl: Omit<Highlight, 'id' | 'createdAt'>): Highlight => {
    const newHl: Highlight = {
      ...hl,
      id: generateId('hl'),
      createdAt: 'Just now'
    };
    setHighlights((prev) => [newHl, ...prev]);
    addActivity({
      type: 'highlight',
      title: `Highlighted text in ${activeChapter?.title || 'Chapter'}`,
      description: `${newHl.category.toUpperCase()}: "${newHl.text.slice(0, 40)}..."`,
      resourceId: hl.resourceId,
      resourceTitle: activeResource?.title
    });
    return newHl;
  };

  const removeHighlight = (id: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id));
  };

  const addNote = (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note => {
    const newNote: Note = {
      ...note,
      id: generateId('note'),
      createdAt: 'Just now',
      updatedAt: 'Just now'
    };
    setNotes((prev) => [newNote, ...prev]);
    return newNote;
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const addBookmark = (bm: Omit<Bookmark, 'id' | 'createdAt'>): Bookmark => {
    const newBm: Bookmark = {
      ...bm,
      id: generateId('bm'),
      createdAt: 'Just now'
    };
    setBookmarks((prev) => [newBm, ...prev]);
    addActivity({
      type: 'bookmark',
      title: `Bookmarked ${newBm.title}`,
      description: newBm.note || 'Saved reading location',
      resourceId: bm.resourceId,
      resourceTitle: activeResource?.title
    });
    return newBm;
  };

  const removeBookmark = (resourceId: string, chapterId: string, sectionId?: string) => {
    setBookmarks((prev) =>
      prev.filter(
        (b) => !(b.resourceId === resourceId && b.chapterId === chapterId && (!sectionId || b.sectionId === sectionId))
      )
    );
  };

  const isBookmarked = (resourceId: string, chapterId: string, sectionId?: string) => {
    return bookmarks.some(
      (b) => b.resourceId === resourceId && b.chapterId === chapterId && (!sectionId || b.sectionId === sectionId)
    );
  };

  const submitQuizResult = (result: Omit<QuizResult, 'id' | 'completedAt'>): QuizResult => {
    const saved: QuizResult = {
      ...result,
      id: generateId('qr'),
      completedAt: 'Just now'
    };
    setQuizResults((prev) => [saved, ...prev]);
    
    // update analytics
    setAnalytics((prev) => ({
      ...prev,
      quizAverage: Math.round((prev.quizAverage + saved.score) / 2)
    }));

    addActivity({
      type: 'quiz',
      title: `Completed ${saved.chapterTitle} Quiz`,
      description: `Scored ${saved.score}% (${saved.correctCount}/${saved.totalQuestions} correct)`,
      resourceId: saved.resourceId,
      resourceTitle: activeResource?.title
    });

    return saved;
  };

  const submitCodeProblem = async (problemId: string, _code: string): Promise<CodeSubmissionResult> => {
    // Simulated realistic technical execution
    await new Promise((resolve) => setTimeout(resolve, 800));
    const problem = codingProblems.find((p) => p.id === problemId);
    
    const result: CodeSubmissionResult = {
      problemId,
      status: 'success',
      runtimeMs: 14,
      memoryMb: 18.2,
      passedCount: problem?.testCases.length || 3,
      totalCount: problem?.testCases.length || 3
    };

    setCodingProblems((prev) =>
      prev.map((p) => (p.id === problemId ? { ...p, status: 'solved' } : p))
    );

    addActivity({
      type: 'coding',
      title: `Solved Problem: ${problem?.title || 'Algorithm'}`,
      description: `Passed all ${result.passedCount} test cases`,
      resourceId: problem?.resourceId,
      resourceTitle: activeResource?.title
    });

    return result;
  };

  const toggleStudyPlanTask = (day: number) => {
    setStudyPlan((prev) => ({
      ...prev,
      schedule: prev.schedule.map((task) =>
        task.day === day ? { ...task, isDone: !task.isDone } : task
      )
    }));
  };

  const addActivity = (act: Omit<LearningActivity, 'id' | 'timestamp'>) => {
    const item: LearningActivity = {
      ...act,
      id: generateId('act'),
      timestamp: 'Just now'
    };
    setActivities((prev) => [item, ...prev.slice(0, 19)]);
  };

  const sendAiMessage = async (
    prompt: string,
    context?: { chapterTitle: string; sectionTitle: string; selectedText?: string }
  ): Promise<AIMessage> => {
    const userMsg: AIMessage = {
      id: generateId('msg-user'),
      role: 'user',
      content: prompt,
      timestamp: 'Just now',
      contextSnapshot: context
    };

    // Realistic contextual AI synthesis based on current reading material
    const assistantMsg: AIMessage = {
      id: generateId('msg-ai'),
      role: 'assistant',
      content: `### Contextual Analysis: ${context?.sectionTitle || activeSection?.title || 'Section'}

Based on **${context?.chapterTitle || activeChapter?.title || 'Current Chapter'}**, here is a structured breakdown:

1. **Core Mechanism**:
   ${prompt.toLowerCase().includes('why') ? 'This mathematical formulation ensures numerical stability and bounds model loss.' : 'The parameter directly balances empirical loss minimization with complexity regularization.'}

2. **Practical Takeaway**:
   When training your model, always monitor the validation curve. If training error is low but validation error is high, apply stronger regularization.

3. **Code Pattern**:
\`\`\`python
# Applying ${activeSection?.title || 'Model'} in practice
model = LogisticRegression(C=1.0, penalty='l2')
model.fit(X_train, y_train)
\`\`\`
`,
      timestamp: 'Just now',
      sourceReferences: [
        {
          chapterTitle: activeChapter?.title || 'Chapter 3',
          sectionTitle: activeSection?.title || 'Section 3.2',
          chapterId: activeChapterId,
          sectionId: activeSectionId,
          location: 'Current Section'
        }
      ]
    };

    setAiSessions((prev) => {
      const currentList = prev[activeResourceId] || [];
      const updated = currentList.map((s) =>
        s.id === activeAiSessionId ? { ...s, messages: [...s.messages, userMsg, assistantMsg] } : s
      );
      return { ...prev, [activeResourceId]: updated };
    });

    return assistantMsg;
  };

  const updateReaderSettings = (settings: Partial<ReaderSettings>) => {
    setReaderSettings((prev) => ({ ...prev, ...settings }));
  };

  return (
    <BookPilotContext.Provider
      value={{
        resources,
        activeResourceId,
        activeResource,
        setActiveResourceId,
        addResource,
        chapters,
        activeChapterId,
        activeChapter,
        setActiveChapterId,
        activeSectionId,
        activeSection,
        setActiveSectionId,
        completeChapter,
        concepts,
        highlights,
        addHighlight,
        removeHighlight,
        notes,
        addNote,
        deleteNote,
        bookmarks,
        addBookmark,
        removeBookmark,
        isBookmarked,
        quizzes,
        quizResults,
        submitQuizResult,
        codingProblems,
        submitCodeProblem,
        studyPlan,
        toggleStudyPlanTask,
        activities,
        analytics,
        addActivity,
        aiSessions,
        activeAiSessionId,
        setActiveAiSessionId,
        sendAiMessage,
        selectionContext,
        setSelectionContext,
        readerSettings,
        updateReaderSettings,
        globalSearchOpen,
        setGlobalSearchOpen
      }}
    >
      {children}
    </BookPilotContext.Provider>
  );
};
