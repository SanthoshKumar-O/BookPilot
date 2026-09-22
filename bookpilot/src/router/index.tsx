import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { DashboardPage } from '../pages/DashboardPage';
import { LibraryPage } from '../pages/LibraryPage';
import { ResourceDetailPage } from '../pages/ResourceDetailPage';
import { ReaderPage } from '../pages/ReaderPage';
import { QuizzesPage } from '../pages/QuizzesPage';
import { QuizDetailPage } from '../pages/QuizDetailPage';
import { CodingPage } from '../pages/CodingPage';
import { CodingDetailPage } from '../pages/CodingDetailPage';
import { StudyPlansPage } from '../pages/StudyPlansPage';
import { ProgressPage } from '../pages/ProgressPage';
import { SettingsPage } from '../pages/SettingsPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'library',
        element: <LibraryPage />,
      },
      {
        path: 'library/:resourceId',
        element: <ResourceDetailPage />,
      },
      {
        path: 'reader/:resourceId/:chapterId',
        element: <ReaderPage />,
      },
      {
        path: 'quizzes',
        element: <QuizzesPage />,
      },
      {
        path: 'quizzes/:quizId',
        element: <QuizDetailPage />,
      },
      {
        path: 'coding',
        element: <CodingPage />,
      },
      {
        path: 'coding/:problemId',
        element: <CodingDetailPage />,
      },
      {
        path: 'study-plans',
        element: <StudyPlansPage />,
      },
      {
        path: 'progress',
        element: <ProgressPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
