import { createContext, useContext } from 'react';

export const MockedAppContext = createContext(null);

export function useAppContext() {
  const context = useContext(MockedAppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContext.Provider');
  }
  return context;
}
