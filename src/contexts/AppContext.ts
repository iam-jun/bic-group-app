import React from 'react';
import { AppConfig } from '~/configs';

type AppContextType = {
  language: string;
  changeLanguage: (language: string) => void;
};

export const AppContext = React.createContext<AppContextType>({
  language: AppConfig.defaultLanguage,
  changeLanguage: (language: string) => language,
});
