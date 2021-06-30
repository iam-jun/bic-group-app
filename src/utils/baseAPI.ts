import axios from 'axios';
import Config from 'react-native-config';

const baseAPI = axios.create({
  baseURL: `${Config.BASE_API_URL}${Config.API_VERSION}`,
  timeOut: 60 * 1000, //60 seconds
  withCredentials: false,
});

const DEBUG = process.env.NODE_ENV === 'development';

baseAPI.interceptors.request.use(
  async config => {
    /** In dev, intercepts request and logs it into console for dev */
    if (DEBUG) {
      console.info('baseAPI.interceptors.request', 'request', config);
    }

    return config;
  },
  error => {
    if (DEBUG) {
      console.info('baseAPI.interceptors.request', 'error', error);
    }
    return Promise.reject(error);
  },
);

baseAPI.interceptors.response.use(
  response => {
    if (DEBUG) {
      console.info('baseAPI.interceptors.response', 'response', response);
    }

    return response.data;
  },
  async error => {
    if (DEBUG) {
      console.log('baseAPI.interceptors.response', 'error', error);
    }

    if (axios.isCancel(error)) {
      console.warn('Operation canceled by cancelling token.');
      return null;
    }

    return Promise.reject({
      ...error,
    });
  },
);

export function setAuthorizationToken(token: string) {
  baseAPI.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export function getAuthorizationToken() {
  return baseAPI.defaults.headers.common.Authorization;
}

export function removeAuthorizationToken() {
  delete baseAPI.defaults.headers.common.Authorization;
}

export function generateCancelationTokenSource() {
  return axios.CancelToken.source();
}

export default baseAPI;
