import React from 'react';

type PreferencesContextType = {
  theme: 'light' | 'dark' | 'system';
  toggleTheme: () => void;
};

export const PreferencesContext = React.createContext<PreferencesContextType>({
  theme: 'light',
  toggleTheme: () => {
    // wait for implementation
  },
});
