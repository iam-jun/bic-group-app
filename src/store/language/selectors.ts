import {createSelector} from 'reselect';
import * as Actions from './constants';

export const languageCommon = (state: any) => state.language;

// Select active language
export const languageSelector = createSelector(
  languageCommon,
  (data) => data.get('language') || Actions.DEFAULT_LANGUAGE_CODE,
);

// Select active language
export const defaultLanguageSelector = createSelector(
  languageCommon,
  (data) => data.get('defaultLanguage') || Actions.DEFAULT_LANGUAGE_CODE,
);

// Select list languages
export const listLanguageSelector = createSelector(
  languageCommon,
  (data) => data.get('languages') || {},
);
