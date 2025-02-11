/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { isEmpty } from 'lodash';
import DeviceInfo from 'react-native-device-info';
import * as Sentry from '@sentry/react-native';

import { DeviceEventEmitter } from 'react-native';
import {
  apiProviders,
  HttpApiRequestConfig,
} from '~/api/apiConfig';
import { handleResponseError, refreshTokenThenExecuteQueueRetry } from '~/api/helper';
import { notificationApiConfig } from '~/api/NotificationApi';
import APIErrorCode from '~/constants/apiErrorCode';
import { uuidRegex } from '~/constants/commonRegex';
import useAuthController from '~/screens/auth/store';
import { EVENT_LOGGER_TAG } from '~/components/LoggerView';
import { LogType } from '~/components/LoggerView/Interface';
import ConvertHelper from '~/utils/convertHelper';
import useMaintenanceStore from '~/store/maintenance';
import useModalStore from '~/store/modal';

const defaultTimeout = 10000;
const commonHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const getBeinIdToken = (): string => {
  let token;
  try {
    token = useAuthController?.getState?.()?.authUser.signInUserSession.idToken.jwtToken;
  } catch (e) {
    console.error('\x1b[35m🐣️ apiRequest getBeinIdToken error: ', e, '\x1b[0m');
  }
  return token;
};

const interceptorsRequestSuccess = (config: AxiosRequestConfig) => {
  const newConfig = { ...config };
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

const interceptorsResponseSuccess = (response: AxiosResponse) => {
  if (
    response.data
    && response.headers?.['content-type']?.includes?.('application/json')
  ) {
    DeviceEventEmitter.emit(EVENT_LOGGER_TAG, { type: LogType.API, data: response });

    response.data = ConvertHelper.camelizeKeys(response.data, {
      excludeValueOfKey: ['reactions_count'],
      excludeKey: [uuidRegex],
    });
  }
  return response;
};

const interceptorsResponseError = async (error: AxiosError) => handleResponseError(error);

const makeHttpRequest = async (requestConfig: HttpApiRequestConfig): Promise<AxiosResponse<any, any>> => {
  const token = getBeinIdToken();
  const tokenHeaders: any = token ? {
    Authorization: getBeinIdToken(),
  } : {};

  const beinHeaders = {
    ...commonHeaders,
    ...requestConfig.headers,
    ...tokenHeaders,
  };

  switch (requestConfig.provider.name) {
    case apiProviders.bein.name:
      requestConfig.headers = beinHeaders;
      requestConfig.withCredentials = true;
      break;
    case apiProviders.beinFeed.name:
    case apiProviders.beinNotification.name:
    case apiProviders.beinUpload.name:
    case apiProviders.beinUser.name:
      requestConfig.headers = beinHeaders;
      break;
    case apiProviders.beinUploadS3.name:
      requestConfig.headers = {
        ...commonHeaders,
        ...requestConfig.headers,
      };
      break;
    case apiProviders.beinMaintenance.name:
      break;
    default:
      return Promise.resolve(null);
  }

  const axiosInstance = axios.create();
  axiosInstance.defaults.timeout = requestConfig.timeout || defaultTimeout;
  axiosInstance.interceptors.request.use(interceptorsRequestSuccess, undefined);
  axiosInstance.interceptors.response.use(interceptorsResponseSuccess, interceptorsResponseError);

  // return
  return axiosInstance(requestConfig);
};

const makePushTokenRequest = (deviceToken: string) => {
  const deviceId = DeviceInfo.getUniqueId();

  Sentry.setTag('deviceId', deviceId);
  Sentry.setTag('pushTokenHeader', deviceToken?.substring?.(0, 10));
  Sentry.setTag('username', useAuthController?.getState?.()?.authUser?.username);
  Sentry.captureMessage('Register push token');

  return makeHttpRequest(notificationApiConfig.pushToken(
    deviceToken, deviceId,
  ));
};

const makeRemovePushTokenRequest = async () => {
  const deviceId = DeviceInfo.getUniqueId();
  const requestConfig = notificationApiConfig.removePushToken(deviceId);
  const axiosInstance = axios.create();
  axiosInstance.defaults.timeout = requestConfig.timeout;

  Sentry.setTag('deviceId', deviceId);
  Sentry.setTag('username', useAuthController?.getState?.()?.authUser?.username);
  Sentry.captureMessage('Remove push token');

  return axiosInstance(requestConfig);
};

const withHttpRequestPromise = async (fn: Function, ...args: any[]) => {
  try {
    const response: any = await makeHttpRequest(isEmpty(args) ? fn() : fn(...args));

    checkCodeResponse(response);

    const isSuccess = response?.data?.data || response?.data?.code === APIErrorCode.Common.SUCCESS;
    if (isSuccess) {
      return Promise.resolve(response?.data);
    }
    return Promise.reject(response);
  } catch (e) {
    return Promise.reject(e);
  }
};

const checkCodeResponse = (response: any) => {
  switch (response?.code) {
    case APIErrorCode.Common.MAINTENANCE:
      useMaintenanceStore.getState().actions.setData(response?.data);
      break;
    case APIErrorCode.Common.UNSUPPORTED_VERSION:
      useModalStore.getState().actions.showUpdateRequiredAlert();
      break;
    default:
      break;
  }
};

export {
  makeHttpRequest,
  makePushTokenRequest,
  makeRemovePushTokenRequest,
  refreshTokenThenExecuteQueueRetry,
  withHttpRequestPromise,
};
