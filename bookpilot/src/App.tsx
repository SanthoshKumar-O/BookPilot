import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { BookPilotProvider } from './context';
import { ErrorBoundary } from './components/common/ErrorBoundary';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BookPilotProvider>
        <RouterProvider router={router} />
      </BookPilotProvider>
    </ErrorBoundary>
  );
};

export default App;
