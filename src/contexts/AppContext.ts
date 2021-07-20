import {StreamClient} from 'getstream';
import React from 'react';
import {AppConfig} from '~/configs';

type AppContextType = {
  language: string;
  changeLanguage: Function;
  streamClient: StreamClient | undefined;
};

export const AppContext = React.createContext({
  language: AppConfig.defaultLanguage,
  changeLanguage: (language: string) => null,
  streamClient: undefined,
} as AppContextType);
