/* eslint-disable @typescript-eslint/ban-ts-comment,no-useless-escape */
import { Auth } from 'aws-amplify';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import i18n from 'i18next';
import _, { isEmpty } from 'lodash';
import moment from 'moment';
import DeviceInfo from 'react-native-device-info';
import { put } from 'redux-saga/effects';

import ApiConfig, {
  HttpApiRequestConfig,
  HttpApiResponseFormat,
} from '~/configs/apiConfig';
import Store from '~/store';
import * as modalActions from '~/store/modal/actions';
import noInternetActions from '~/screens/NoInternet/redux/actions';
import { ActionTypes, createAction } from '~/utils';
import { updateUserFromSharedPreferences } from './sharePreferences';
import API_ERROR_CODE from '~/constants/apiErrorCode';
import ConvertHelper from '~/utils/convertHelper';
import groupsActions from '~/screens/Groups/redux/actions';

const defaultTimeout = 10000;
const commonHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const _dispatchLogout = async () => {
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

const getBeinIdToken = (): string => _.get(
  Store.getCurrentUser(),
  'signInUserSession.idToken.jwtToken',
  '',
);

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
    case ApiConfig.providers.bein.name:
    case ApiConfig.providers.beinFeed.name:
    case ApiConfig.providers.beinNotification.name:
    case ApiConfig.providers.beinUpload.name:
      if (!error.config.headers?.Authorization) {
        return Promise.reject(error);
      }
      break;
    default:
      break;
  }

  //= ================= 401 Unauthorized ==================

  // create new promise
  const newReqPromise = new Promise((resolve, reject) => {
    const newOrgConfig = { ...error.config };
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
    countLimitRetry += 1;
    if (countLimitRetry > 10) {
      const timeNow = moment().unix();
      if (timeNow <= timeEndCountLimit) {
        refreshFailKickOut();
        return;
      }
      countLimitRetry = 0;
      timeEndCountLimit = 0;
    }
    if (countLimitRetry === 1) {
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
      }
      _dispatchRefreshTokenSuccess(newToken, refreshToken, idToken, exp);

      // For sharing data between Group and Chat
      await updateUserFromSharedPreferences({ token: idToken, exp });
    } catch (e) {
      refreshFailKickOut();
      return;
    }

    unauthorizedReqQueue.forEach((callback) => callback(isSuccess));
    unauthorizedReqQueue = [];

    isRefreshingToken = false;
  }
};

const handleResponseError = async (
  error: AxiosError,
): Promise<HttpApiResponseFormat | unknown> => {
  // Sometime aws return old id token, using this old id token to refresh token will return 401
  // should reset value isRefreshingToken for refresh later

  // Recheck this issue!

  // const authConfig = apiConfig.App.tokens();
  // if (authConfig.url === error?.config?.url) {
  //   isRefreshingToken = false;
  //   await timeout(5000);
  // }

  if (error.response) {
    const responseTokenExpired = error.response.status === 401
      || error.response?.data?.code === API_ERROR_CODE.AUTH.TOKEN_EXPIRED;
    // @ts-ignore
    if (responseTokenExpired && error.config.useRetry) {
      return handleRetry(error);
    }

    // @ts-ignore
    if (error.response.status === 403 && error.config.useRetry) {
      Store.store.dispatch(groupsActions.getMyPermissions());
    }

    return mapResponseSuccessBein(error.response);
  } if (error.request) {
    // cancel request
    if (error.request.status !== 0) {
      console.error(error.request);
      handleSystemIssue();
    }

    return {
      code: error.request.status, // request made, no response
      data: null,
      meta: {
        message: i18n.t('common:text_error_message'),
      },
    };
  }
  return {
    code: 600, // request config error?
    data: null,
    meta: {
      message: `unexpected error: ${error.message}`,
    },
  };
};

const mapResponseSuccessBein = (
  response: AxiosResponse,
): HttpApiResponseFormat => ({
  code: response.data.code,
  data: response.data.data,
  meta: response.data.meta,
});

const shouldApplyAutoSnakeCamel = (endPoint?: string) => {
  let result = false;
  const uuidRegex = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'
  // add apis have param in path to this array
  const apisWithParam = [
    `${ApiConfig.providers.bein.url}communities/${uuidRegex}/group-structure/order`,
    `${ApiConfig.providers.bein.url}communities/${uuidRegex}/group-structure/move-targets/[A-Za-z_$@0-9]*`,
    `${ApiConfig.providers.bein.url}communities/${uuidRegex}/group-structure/move`,
    `${ApiConfig.providers.bein.url}communities/${uuidRegex}/group-structure/collapse/[A-Za-z_$@0-9]*`,
    `${ApiConfig.providers.bein.url}communities/${uuidRegex}/group-structure`,
    `${ApiConfig.providers.bein.url}communities/${uuidRegex}/scheme`,
    `${ApiConfig.providers.bein.url}communities/${uuidRegex}/schemes`,
    `${ApiConfig.providers.bein.url}communities/${uuidRegex}`,
    `${ApiConfig.providers.bein.url}groups/${uuidRegex}`,
    `${ApiConfig.providers.bein.url}communities/${uuidRegex}/members`,
    `${ApiConfig.providers.bein.url}me/communities/${uuidRegex}/groups`,
    `${ApiConfig.providers.bein.url}communities/${uuidRegex}/groups/discover`,
    `${ApiConfig.providers.bein.url}groups/${uuidRegex}/users`,
    `${ApiConfig.providers.bein.url}communities/${uuidRegex}/join`,
    `${ApiConfig.providers.bein.url}communities/${uuidRegex}/cancel-joining-request`,
    `${ApiConfig.providers.bein.url}communities/${uuidRegex}/joining-requests`,
    `${ApiConfig.providers.bein.url}communities/${uuidRegex}/joining-requests/${uuidRegex}/approve`,
    `${ApiConfig.providers.bein.url}communities/${uuidRegex}/joining-requests/${uuidRegex}/decline`,
    `${ApiConfig.providers.bein.url}communities/${uuidRegex}/joining-requests/approve`,
    `${ApiConfig.providers.bein.url}communities/${uuidRegex}/joining-requests/decline`,
    `${ApiConfig.providers.bein.url}groups/${uuidRegex}/join`,
    `${ApiConfig.providers.bein.url}groups/${uuidRegex}/cancel-joining-request`,
    `${ApiConfig.providers.bein.url}groups/${uuidRegex}/leave`,
    `${ApiConfig.providers.bein.url}groups/${uuidRegex}/inner-groups-have-last-admin/${uuidRegex}`,
    `${ApiConfig.providers.bein.url}groups/${uuidRegex}/inner-groups`,
    `${ApiConfig.providers.bein.url}groups/${uuidRegex}/joinable-users`,
    `${ApiConfig.providers.bein.url}groups/${uuidRegex}/users/add`,
    `${ApiConfig.providers.bein.url}groups/${uuidRegex}/users/remove`,
    `${ApiConfig.providers.bein.url}groups/${uuidRegex}/assign-admin`,
  ];
  apisWithParam.forEach((api) => {
    if (new RegExp(api, 'g').test(endPoint || '')) {
      result = true;
    }
  });

  switch (endPoint) {
    case `${ApiConfig.providers.bein.url}post-audiences`:
    case `${ApiConfig.providers.bein.url}users/mentionable`:
    case `${ApiConfig.providers.bein.url}me/permissions`:
    case `${ApiConfig.providers.bein.url}system-scheme`:
    case `${ApiConfig.providers.bein.url}permissions/categories`:
    case `${ApiConfig.providers.bein.url}me/communities`:
    case `${ApiConfig.providers.bein.url}communities/discover`:
    case `${ApiConfig.providers.bein.url}communities`:
      result = true;
      break;
    default:
      break;
  }
  return result;
};

const interceptorsRequestSuccess = (config: AxiosRequestConfig) => {
  const newConfig = { ...config };

  // apply rule snake camel for each bein group's api
  // we will remove this check after all apis is updated
  if (shouldApplyAutoSnakeCamel(config?.url)) {
    // update data of upload file request will lead to some unknown error
    if (newConfig.headers?.['Content-Type']?.includes('multipart/form-data')) {
      return newConfig;
    }

    if (config.params) {
      newConfig.params = ConvertHelper.decamelizeKeys(config.params);
    }
    if (config.data) {
      newConfig.data = ConvertHelper.decamelizeKeys(config.data);
    }

    return newConfig;
  }

  return newConfig;
};

const interceptorsRequestSnakeSuccess = (config: AxiosRequestConfig) => {
  const newConfig = { ...config };

  // update data of upload file request will lead to some unknown error
  if (newConfig.headers?.['Content-Type']?.includes('multipart/form-data')) {
    return newConfig;
  }

  if (config.params) {
    newConfig.params = ConvertHelper.decamelizeKeys(config.params);
  }
  if (config.data) {
    newConfig.data = ConvertHelper.decamelizeKeys(config.data);
  }
  return newConfig;
};

const interceptorsResponseCamelSuccess = (response: AxiosResponse) => {
  if (
    response.data
    && response.headers?.['content-type']?.includes?.('application/json')
  ) {
    response.data = ConvertHelper.camelizeKeys(response.data, {
      excludeValueOfKey: ['reactions_count'],
      excludeKey: [/^[a-f0-9\-]{36}$/i],
    });
  }
  return response;
};

const interceptorsResponseSuccess = (response: AxiosResponse) => {
  // apply rule snake camel for each bein group's api
  // we will remove this check after all apis is updated
  if (shouldApplyAutoSnakeCamel(response?.config?.url)) {
    if (
      response.data
      && response.headers?.['content-type']?.includes?.('application/json')
    ) {
      response.data = ConvertHelper.camelizeKeys(response.data, {
        excludeValueOfKey: ['reactions_count'],
        excludeKey: [/^[a-f0-9\-]{36}$/i],
      });
    }
    return response;
  }
  return response;
};

const interceptorsResponseError = async (error: AxiosError) => handleResponseError(error);

const makeHttpRequest = async (requestConfig: HttpApiRequestConfig) => {
  let interceptorRequestSuccess;
  let interceptorResponseSuccess;
  let interceptorResponseError;

  const tokenHeaders: any = {
    Authorization: getBeinIdToken(),
  };

  const beinHeaders = {
    ...commonHeaders,
    ...requestConfig.headers,
    ...tokenHeaders,
  };

  switch (requestConfig.provider.name) {
    case ApiConfig.providers.bein.name:
      interceptorRequestSuccess = interceptorsRequestSuccess;
      interceptorResponseSuccess = interceptorsResponseSuccess;
      interceptorResponseError = interceptorsResponseError;
      requestConfig.headers = beinHeaders;
      requestConfig.withCredentials = true;
      break;
    case ApiConfig.providers.beinFeed.name:
    case ApiConfig.providers.beinNotification.name:
    case ApiConfig.providers.beinUpload.name:
      interceptorRequestSuccess = interceptorsRequestSnakeSuccess;
      interceptorResponseSuccess = interceptorsResponseCamelSuccess;
      interceptorResponseError = interceptorsResponseError;
      requestConfig.headers = beinHeaders;
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
  return makeHttpRequest(ApiConfig.App.pushToken(deviceToken, deviceId));
};

const makeRemovePushTokenRequest = async () => {
  const deviceId = DeviceInfo.getUniqueId();
  const requestConfig = ApiConfig.App.removePushToken(deviceId);
  const axiosInstance = axios.create();
  axiosInstance.defaults.timeout = requestConfig.timeout;
  return axiosInstance(requestConfig);
};

const withHttpRequestPromise = async (fn: Function, ...args: any[]) => {
  try {
    const response: any = await makeHttpRequest(isEmpty(args) ? fn() : fn(...args));
    const isSuccess = response?.data?.data || response?.data?.code === API_ERROR_CODE.COMMON.SUCCESS
    if (isSuccess) {
      return Promise.resolve(response?.data);
    }
    return Promise.reject(response);
  } catch (e) {
    return Promise.reject(e);
  }
}

export {
  makeHttpRequest,
  makePushTokenRequest,
  makeRemovePushTokenRequest,
  mapResponseSuccessBein,
  getTokenAndCallBackBein,
  withHttpRequestPromise,
};
