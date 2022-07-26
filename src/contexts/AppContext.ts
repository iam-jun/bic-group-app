import React from 'react';
import { AppConfig } from '~/configs';

type AppContextType = {
  language: string;
  changeLanguage: Function;
};

export const AppContext = React.createContext({
  language: AppConfig.defaultLanguage,
  changeLanguage: (language: string) => null,
} as AppContextType);
