import {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
import i18n from 'i18next';
import _ from 'lodash';
import {Alert} from 'react-native';

import apiConfig from '~/configs/apiConfig';
import {ActionTypes, createAction, ReduxAction} from '~/utils';
import httpService from './httpService';
import Store from '~/store';

const getRefreshToken = () => {
  return _.get(Store.getCurrentUser(), 'refreshToken', null);
};

const getAccessToken = () => {
  return _.get(Store.getCurrentUser(), 'accessToken', null);
};

// const getDeviceId = () => {
//   return _.get(Store.getCurrentUser(), 'deviceId', null);
// };

const getAuthenticationHeader = (): string | null => {
  const accessToken = getAccessToken();
  if (accessToken) {
    return `Bearer ${accessToken}`;
  }
  return null;
};

const getCommonAuthHeader = (): Record<string, unknown> => {
  // const deviceId = getDeviceId()
  const authenticationHeader = getAuthenticationHeader();
  return {
    // DeviceID: deviceId,
    Authorization: authenticationHeader,
  };
};

// retryHandler
interface UnauthorizedReq {
  (success: unknown): Promise<void>;
}

let unauthorizedReqQueue: UnauthorizedReq[] = [];
const retryHandler = async (
  error: RestfulResponse,
  orgConfig: CustomAxiosRequestConfig,
): Promise<unknown> => {
  // check if error is not 401 or is not unauthorized type
  if (error.status !== 401) {
    return Promise.reject(error);
  }

  // check if orgConfig contain Authorization key
  if (!orgConfig.headers.Authorization) {
    return Promise.reject(error);
  }

  //================== 401 Unauthorized ==================

  // create new promise
  const newReqPromise = new Promise((resolve, reject) => {
    const newOrgConfig = {...orgConfig};
    // delete newOrgConfig.headers.Authorization

    const callback: UnauthorizedReq = async (success: unknown) => {
      if (success !== true) {
        return reject(error);
      }

      try {
        const resp = await httpService.request(newOrgConfig);
        return resolve(resp);
      } catch (e) {
        return reject(e);
      }
    };

    // add callback
    unauthorizedReqQueue.push(callback);
  });

  // create request to refresh token
  getTokenAndCallBack();

  // next
  return newReqPromise;
};

// get refresh token
let isRefreshingToken = false;
const getTokenAndCallBack = () => {
  if (!isRefreshingToken) {
    isRefreshingToken = true;

    getTokenFromServer()
      // @ts-ignore
      .then(({access_token, refresh_token}) => {
        if (access_token && refresh_token) {
          // save tokens
          Store.store.dispatch(
            createAction(ActionTypes.REFRESH_TOKEN, {
              access_token,
              refresh_token,
            }),
          );
          return true;
        } else {
          return false;
        }
      })
      .catch(failure => {
        return failure;
      })
      .then(isSuccess => {
        // request again
        unauthorizedReqQueue.forEach(callback => callback(isSuccess));
        unauthorizedReqQueue = [];
        isRefreshingToken = false;
      });
  }
};

const getTokenFromServer = async () => {
  const refresh_token = getRefreshToken();

  if (!refresh_token) {
    return Promise.reject(null);
  }

  // Request
  return httpService
    .requestWithoutToken(apiConfig.Auth.refreshToken(refresh_token))
    .then(function (response) {
      const access_token = _.get(response, 'data.data.access_token', null);
      const refresh_token = _.get(response, 'data.data.refresh_token', null);
      if (access_token && refresh_token) {
        return Promise.resolve(<TokenResponse>{access_token, refresh_token});
      } else {
        return Promise.reject(null);
      }
    })
    .catch(function (error: unknown) {
      console.log('error when refresh token:', error);
      Alert.alert(
        i18n.t('error:alert_title'),
        i18n.t('error:http:token_expired'),
      );
      Store.store.dispatch<ReduxAction>(
        // createAction(ActionTypes.LOG_OUT, {
        createAction(ActionTypes.REFRESH_TOKEN, {
          user: Store.getCurrentUser(),
        }),
      );
    });
};

export default {
  retryHandler,
  getAuthenticationHeader,
  getCommonAuthHeader,
};

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  provider?: string;
  isHandleUnauthorized?: boolean;
}

export interface CustomAxiosError extends AxiosError {
  config: CustomAxiosRequestConfig;
  clientMessage?: string;
}

export interface CustomAxiosResponse extends AxiosResponse {
  config: CustomAxiosRequestConfig;
}

export interface RestfulResponse {
  status: number;
  data?: unknown;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
}
