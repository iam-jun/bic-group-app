import {Platform} from 'react-native';

export const clearUserCookies = () => {
  if (Platform.OS !== 'web') return;

  const cookieList = ['CTOKEN'];
  cookieList.forEach(cookieName => {
    /**
     * We need to clear the cookie without the domain, with the domain, and with both the domain and path set because we
     * can't tell if the server set the cookie with or without the domain.
     * The server will have set the domain if ServiceSettings.EnableCookiesForSubdomains is true
     * The server will have set a non-default path if Mattermost is also served from a subpath.
     */
    document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
    document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=${window.basename}`;
    document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=${window.location.hostname};path=/`;
    document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=${window.location.hostname};path=${window.basename}`;
  });
};
