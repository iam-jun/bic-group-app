import {Platform} from 'react-native';
import {getEnv} from './env';

/**
 * Do not change
 * This cookie names are shared with chat web
 */
const COOKIE_DICTIONARY = {
  BUSER_USERNAME: 'BUSER_USERNAME',
  BUSER_FULLNAME: 'BUSER_FULLNAME',
  BUSER_EMAIL: 'BUSER_EMAIL',
  BUSER_AVATAR: 'BUSER_AVATAR',
  CUSER_EMAIL: 'CUSER_EMAIL',
};

type CookieNameType = keyof typeof COOKIE_DICTIONARY;

const isOnHTTPS = () => {
  return getEnv('SELF_DOMAIN')?.includes('https');
};

const COOKIE_PREFIX_FOR_SECURE = '__Secure-';

/**
 * As cookies' name is different between localhost and other environments,
 * we need to get the correct cookie name via this function
 */
const getCookieName = (cookie: CookieNameType) => {
  let cookiePrefix = '';
  if (isOnHTTPS()) {
    cookiePrefix = COOKIE_PREFIX_FOR_SECURE;
  }

  return `${cookiePrefix}${cookie}`;
};

export const saveCookie = (
  cookie: CookieNameType,
  value: string,
  expires?: string,
) => {
  const cookieName = getCookieName(cookie);
  const secureAttribute = isOnHTTPS() ? 'Secure' : '';

  document.cookie = `${cookieName}=${value}; Domain=${window.location.hostname}; SameSite=strict; ${secureAttribute}; ${expires}`;
};

const clearCookie = (cookie: CookieNameType) => {
  const expires = 'expires=Thu, 01 Jan 1970 00:00:01 GMT';
  saveCookie(cookie, '', expires);
};

export const clearUserCookies = () => {
  if (Platform.OS !== 'web') return;

  const cookieList = Object.values(COOKIE_DICTIONARY) as CookieNameType[];
  cookieList.forEach(cookie => clearCookie(cookie));
};

export const getUserEmailFromChatCookie = () => {
  if (Platform.OS !== 'web') return '';

  const COOKIE_EMAIL_STARTER = getCookieName('CUSER_EMAIL') + '=';
  if (
    typeof document !== 'undefined' &&
    typeof document.cookie !== 'undefined'
  ) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(COOKIE_EMAIL_STARTER)) {
        return cookie.replace(COOKIE_EMAIL_STARTER, '');
      }
    }
  }

  return '';
};
