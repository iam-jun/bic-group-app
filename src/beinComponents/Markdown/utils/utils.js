import {StyleSheet} from 'react-native';
import * as ThemeUtils from './themeUtils';
import {languages} from '../utils/config';

export function getScheme(url) {
  const match = /([a-z0-9+.-]+):/i.exec(url);

  return match && match[1];
}

export function makeStyleSheetFromTheme(getStyleFromTheme) {
  return ThemeUtils.makeStyleFromTheme(theme => {
    return StyleSheet.create(getStyleFromTheme(theme));
  });
}

export const changeOpacity = ThemeUtils.changeOpacity;

export const blendColors = ThemeUtils.blendColors;

export function concatStyles(...styles) {
  return [].concat(styles);
}

export function getDisplayNameForLanguage(language) {
  return languages[language.toLowerCase()] || '';
}

export function preventDoubleTap(func, doublePressDelay = 300) {
  let canPressWrapped = true;

  return (...args) => {
    if (canPressWrapped) {
      canPressWrapped = false;
      func(...args);

      setTimeout(() => {
        canPressWrapped = true;
      }, doublePressDelay);
    }
  };
}
