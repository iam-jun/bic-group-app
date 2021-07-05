import React from 'react';

type AppContextType = {};

export const AppContext = React.createContext({
  language: 'en',
  changeLanguage: () => null,
} as AppContextType);
