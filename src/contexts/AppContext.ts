import React from 'react';

type AppContextType = {
  language: string;
  changeLanguage: Function;
};

export const AppContext = React.createContext({
  language: 'en',
  changeLanguage: (language: string) => null,
} as AppContextType);
