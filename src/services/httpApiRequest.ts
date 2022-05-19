import {Auth} from 'aws-amplify';
import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
import i18n from 'i18next';
import _ from 'lodash';
import moment from 'moment';
import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {put} from 'redux-saga/effects';

import apiConfig, {
  HttpApiRequestConfig,
  HttpApiResponseFormat,
} from '~/configs/apiConfig';
import Store from '~/store';
import * as modalActions from '~/store/modal/actions';
import noInternetActions from '~/screens/NoInternet/redux/actions';
import {ActionTypes, createAction} from '~/utils';
import {updateUserFromSharedPreferences} from './sharePreferences';
import menuDataHelper from '~/screens/Menu/helper/MenuDataHelper';
import API_ERROR_CODE from '~/constants/apiErrorCode';

const defaultTimeout = 10000;
const commonHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const _dispatchLogout = async () => {
  /**
   * Need calling this API before sign out to remove cookies
   * And not putting it in saga as it needs field Authorization, which is extract from store.
   * If we call it in saga, it will be null, and we cannot call API.
   */
  if (Platform.OS === 'web') {
    await menuDataHelper.logout();
  }
  Store.store.dispatch(createAction(ActionTypes.UnauthorizedLogout));
};

const _dispatchSessionExpire = () => {
  Store.store.dispatch(
    modalActions.showAlert({
      title: i18n.t('auth:text_kickout_title'),
      content: i18n.t('auth:text_kickout_desc'),
      onConfirm: () => put(modalActions.hideAlert()),
      confirmLabel: i18n.t('auth:text_kickout_confirm_button'),
    }),
  );
};

const _dispatchRefreshTokenSuccess = (
  newToken: string,
  refreshToken: string,
  idToken: string,
  idTokenExp: number,
) => {
  Store.store.dispatch(
    createAction(ActionTypes.RefreshTokenSuccessBein, {
      newToken,
      refreshToken,
      idToken,
      idTokenExp,
    }),
  );
};

const dispatchStoreAuthTokens = (
  feedAccessToken: string,
  notiSubscribeToken: string,
) => {
  Store.store.dispatch(
    createAction(ActionTypes.SaveAuthTokens, {
      feedAccessToken,
      notiSubscribeToken,
    }),
  );
};

const refreshFailKickOut = () => {
  _dispatchLogout();
  _dispatchSessionExpire();
  isRefreshingToken = false;
  countLimitRetry = 0;
  timeEndCountLimit = 0;
  unauthorizedReqQueue = [];
};

const handleSystemIssue = () => {
  Store.store.dispatch(noInternetActions.checkInternetReachable());

  const state = Store.store.getState();
  const isInternetReachable: boolean = _.get(
    state,
    'noInternet.isInternetReachable',
    false,
  );

  if (isInternetReachable === false) return;

  Store.store.dispatch(noInternetActions.showSystemIssueThenLogout());
};

const logInterceptorsRequestSuccess = (config: AxiosRequestConfig) => {
  console.log(
    '%c ================ REQUEST ================',
    'background: #ffff00; color: #000',
    config.url,
    config.method?.toUpperCase(),
    config,
  );
  return config;
};

const logInterceptorsResponseSuccess = (response: AxiosResponse) => {
  console.log(
    '%c ================ RESPONSE SUCCESS ================',
    'background: #66ff33; color: #000',
    response.config.url,
    response.config.method?.toUpperCase(),
    response,
  );
};

const logInterceptorsResponseError = (error: AxiosError) => {
  console.log(
    '%c ================ RESPONSE ERROR ================',
    'background: red; color: #fff',
    error.config.url,
    error.config.method?.toUpperCase(),
    error,
  );
};

const getBeinIdToken = (): string => {
  return _.get(
    Store.getCurrentUser(),
    'signInUserSession.idToken.jwtToken',
    '',
  );
};

const getFeedAccessToken = (): string => {
  return _.get(Store.getCurrentAuth(), 'feed.accessToken', '');
};

// retryHandler
interface UnauthorizedReq {
  (success: boolean): Promise<void>;
}

let unauthorizedReqQueue: UnauthorizedReq[] = [];
const handleRetry = async (error: AxiosError) => {
  // check if error is not 401 or is not unauthorized type
  // check if orgConfig contain Authorization key
  // @ts-ignore
  switch (error.config?.provider?.name) {
    case apiConfig.providers.bein.name:
    case apiConfig.providers.beinFeed.name:
    case apiConfig.providers.beinNotification.name:
    case apiConfig.providers.beinUpload.name:
      if (!error.config.headers?.Authorization) {
        return Promise.reject(error);
      }
      break;
  }

  //================== 401 Unauthorized ==================

  // create new promise
  const newReqPromise = new Promise((resolve, reject) => {
    const newOrgConfig = {...error.config};
    delete newOrgConfig.headers?.Authorization;

    const callback: UnauthorizedReq = async (success: boolean) => {
      if (!success) {
        return reject(error);
      }

      try {
        // @ts-ignore
        const resp = await makeHttpRequest(newOrgConfig);
        return resolve(resp);
      } catch (e) {
        return reject(e);
      }
    };

    // add callback
    unauthorizedReqQueue.push(callback);
  });

  // create request to refresh token
  if (error.config.headers) {
    await getTokenAndCallBackBein(error.config.headers.Authorization);
  }

  // next
  return newReqPromise;
};

// get refresh token
let isRefreshingToken = false;
let countLimitRetry = 0;
let timeEndCountLimit = 0;
const getTokenAndCallBackBein = async (oldBeinToken: string): Promise<void> => {
  if (!isRefreshingToken) {
    isRefreshingToken = true;
    countLimitRetry++;
    if (countLimitRetry > 10) {
      const timeNow = moment().unix();
      if (timeNow <= timeEndCountLimit) {
        refreshFailKickOut();
        return;
      } else {
        countLimitRetry = 0;
        timeEndCountLimit = 0;
      }
    }
    if (countLimitRetry == 1) {
      timeEndCountLimit = moment(moment.now()).add(1, 'minutes').unix(); // 1 minute from now
    }
    let isSuccess = true;

    try {
      const sessionData = await Auth.currentSession();
      const newToken = sessionData?.getAccessToken().getJwtToken();
      const refreshToken = sessionData?.getRefreshToken().getToken();
      const idToken = sessionData?.getIdToken().getJwtToken();
      const exp = sessionData?.getIdToken().getExpiration();

      if (idToken === oldBeinToken) {
        await Auth.currentAuthenticatedUser(); // TODO: verify when change password kickout
        refreshFailKickOut();
        isSuccess = false;
        return;
      } else {
        _dispatchRefreshTokenSuccess(newToken, refreshToken, idToken, exp);

        //For sharing data between Group and Chat
        await updateUserFromSharedPreferences({token: idToken, exp});
      }
      const isRefreshSuccess = await refreshAuthTokens();
      if (!isRefreshSuccess) {
        await Auth.currentAuthenticatedUser();
        refreshFailKickOut();
        isSuccess = false;
        return;
      }
    } catch (e) {
      refreshFailKickOut();
      return;
    }

    unauthorizedReqQueue.forEach(callback => callback(isSuccess));
    unauthorizedReqQueue = [];

    isRefreshingToken = false;
  }
};

const handleResponseError = async (
  error: AxiosError,
): Promise<HttpApiResponseFormat | unknown> => {
  // Sometime aws return old id token, using this old id token to refresh token will return 401
  // should reset value isRefreshingToken for refresh later
  const authConfig = apiConfig.App.tokens();
  if (authConfig.url === error?.config?.url) {
    isRefreshingToken = false;
    await timeout(5000);
  }

  if (error.response) {
    const responseTokenExpired =
      error.response.status === 401 ||
      error.response?.data?.code === API_ERROR_CODE.AUTH.TOKEN_EXPIRED;
    // @ts-ignore
    if (responseTokenExpired && error.config.useRetry) {
      return handleRetry(error);
    }
    return mapResponseSuccessBein(error.response);
  } else if (error.request) {
    console.error(error.request);
    handleSystemIssue();

    return {
      code: error.request.status, // request made, no response
      data: null,
      meta: {
        message: i18n.t('common:text_error_message'),
      },
    };
  } else {
    return {
      code: 600, // request config error?
      data: null,
      meta: {
        message: `unexpected error: ${error.message}`,
      },
    };
  }
};

const mapResponseSuccessBein = (
  response: AxiosResponse,
): HttpApiResponseFormat => {
  return {
    code: response.data.code,
    data: response.data.data,
    meta: response.data.meta,
  };
};

const interceptorsRequestSuccess = (requestConfig: AxiosRequestConfig) => {
  // logInterceptorsRequestSuccess(requestConfig);
  return requestConfig;
};

const interceptorsResponseSuccess = (response: AxiosResponse) => {
  // logInterceptorsResponseSuccess(response);
  return response;
};

const interceptorsResponseError = async (error: AxiosError) => {
  // logInterceptorsResponseError(error);
  return handleResponseError(error);
};

const refreshAuthTokens = async () => {
  const dataTokens = await getAuthTokens();
  if (!dataTokens) {
    return false;
  }

  const {feedAccessToken, notiSubscribeToken} = dataTokens;
  dispatchStoreAuthTokens(feedAccessToken, notiSubscribeToken);

  return true;
};

const getAuthTokens = async () => {
  try {
    const httpResponse = await makeHttpRequest(apiConfig.App.tokens());
    // @ts-ignore
    const data = mapResponseSuccessBein(httpResponse);

    // @ts-ignore
    if (data.code != 200 && data.code?.toUpperCase?.() !== 'OK') return false;

    const {access_token: feedAccessToken, subscribe_token: notiSubscribeToken} =
      data.data?.stream;

    return {
      feedAccessToken,
      notiSubscribeToken,
    };
  } catch (e) {
    return false;
  }
};

const makeHttpRequest = async (requestConfig: HttpApiRequestConfig) => {
  let interceptorRequestSuccess,
    interceptorResponseSuccess,
    interceptorResponseError;

  const tokenHeaders: any = {
    Authorization: getBeinIdToken(),
  };

  switch (requestConfig.provider.name) {
    case apiConfig.providers.bein.name:
      interceptorRequestSuccess = interceptorsRequestSuccess;
      interceptorResponseSuccess = interceptorsResponseSuccess;
      interceptorResponseError = interceptorsResponseError;
      requestConfig.headers = {
        ...commonHeaders,
        ...requestConfig.headers,
        ...tokenHeaders,
      };
      requestConfig.withCredentials = true;
      break;
    case apiConfig.providers.beinFeed.name:
    case apiConfig.providers.beinNotification.name:
    case apiConfig.providers.beinUpload.name:
      interceptorRequestSuccess = interceptorsRequestSuccess;
      interceptorResponseSuccess = interceptorsResponseSuccess;
      interceptorResponseError = interceptorsResponseError;
      requestConfig.headers = {
        ...commonHeaders,
        ...requestConfig.headers,
        ...tokenHeaders,
      };
      break;
    default:
      return Promise.resolve(false);
  }

  const axiosInstance = axios.create();
  axiosInstance.defaults.timeout = requestConfig.timeout || defaultTimeout;
  axiosInstance.interceptors.request.use(interceptorRequestSuccess, undefined);
  axiosInstance.interceptors.response.use(
    interceptorResponseSuccess,
    interceptorResponseError,
  );

  // return
  return axiosInstance(requestConfig);
};

const makePushTokenRequest = (deviceToken: string) => {
  const deviceId = DeviceInfo.getUniqueId();
  return makeHttpRequest(apiConfig.App.pushToken(deviceToken, deviceId));
};

const makeRemovePushTokenRequest = async () => {
  const deviceId = DeviceInfo.getUniqueId();
  const requestConfig = apiConfig.App.removePushToken(deviceId);
  const axiosInstance = axios.create();
  axiosInstance.defaults.timeout = requestConfig.timeout;
  return axiosInstance(requestConfig);
};

function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export {
  makeHttpRequest,
  makePushTokenRequest,
  makeRemovePushTokenRequest,
  mapResponseSuccessBein,
  refreshAuthTokens,
  getTokenAndCallBackBein,
};
