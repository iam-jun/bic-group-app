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

export const saveCookie = (cookie: CookieNameType, value: string) => {
  const cookieName = getCookieName(cookie);

  let secureAttribute = '';
  if (isOnHTTPS()) {
    secureAttribute = 'Secure';
  }

  document.cookie = `${cookieName}=${value}; Domain=${window.location.hostname}; SameSite=strict; ${secureAttribute}`;
};

export const clearUserCookies = () => {
  if (Platform.OS !== 'web') return;

  const cookieList = Object.values(COOKIE_DICTIONARY) as CookieNameType[];

  cookieList.forEach(cookie => {
    const cookieName = getCookieName(cookie);

    document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
    document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=${window.location.hostname};path=/`;
  });
};
