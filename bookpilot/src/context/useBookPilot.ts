import { useContext } from 'react';
import { BookPilotContext } from './BookPilotContextCore';

export const useBookPilot = () => {
  const context = useContext(BookPilotContext);
  if (!context) {
    throw new Error('useBookPilot must be used within a BookPilotProvider');
  }
  return context;
};
