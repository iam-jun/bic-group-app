/* eslint-disable @typescript-eslint/ban-ts-comment,no-console */

import { Auth } from 'aws-amplify';
import { AxiosError } from 'axios';
import i18n from 'i18next';
import { DeviceEventEmitter } from 'react-native';
import { apiProviders, HttpApiResponseFormat } from '~/api/apiConfig';
import { makeHttpRequest } from '~/api/apiRequest';
import { EVENT_LOGGER_TAG } from '~/components/LoggerView';
import { LogType } from '~/components/LoggerView/Interface';
import APIErrorCode from '~/constants/apiErrorCode';
import { uuidRegex } from '~/constants/commonRegex';
import useAuthController from '~/screens/auth/store';
import { updateUserFromSharedPreferences } from '~/services/sharePreferences';
import useNetworkStore from '~/store/network';
import useMyPermissionsStore from '~/store/permissions';
import { timeOut } from '~/utils/common';
import ConvertHelper from '~/utils/convertHelper';

interface UnauthorizedReq {
  (refreshTokenSuccess: boolean): Promise<void>;
}

// handle retry
let unauthorizedReqQueue: UnauthorizedReq[] = [];

// handle refresh token
let isRefreshingToken = false;
let countRetry = 0;
const sleepBeforeRetry = [0, 1000, 2000, 3000, 5000, 8000, 13000, 21000];

const resetTempValue = () => {
  isRefreshingToken = false;
  countRetry = 0;
  unauthorizedReqQueue = [];
};

export const handleResponseError = async (axiosError: AxiosError): Promise<HttpApiResponseFormat | unknown> => {
  // Sometime aws return old id token, using this old id token to refresh token will return 401
  // should reset value isRefreshingToken for refresh later

  DeviceEventEmitter.emit(EVENT_LOGGER_TAG, { type: LogType.API, data: axiosError });

  if (isRequestHasResponse(axiosError)) {
    if (shouldRetryTokenExpireRequest(axiosError)) {
      return prepareRefreshTokenAndRetry(axiosError);
    }
    if (shouldRefreshPermission(axiosError)) {
      useMyPermissionsStore.getState().actions.getMyPermissions();
    }
    return ConvertHelper.camelizeKeys(axiosError.response.data, {
      excludeValueOfKey: ['reactions_count'],
      excludeKey: [uuidRegex],
    });
  }
  if (isRequestNotHasResponse(axiosError)) {
    if (isRequestNotCancelled(axiosError)) {
      handleSystemIssue(axiosError);
    }
    return {
      code: axiosError.request.status,
      data: null,
      meta: { message: i18n.t('common:text_error_message') },
    };
  }
  return {
    code: 600, // just an unknown error, something happened in setting up the request that triggered an error
    data: null,
    meta: { message: `unexpected error: ${axiosError.message}` },
  };
};

const isRequestHasResponse = (axiosError: AxiosError) => axiosError.response;
const isRequestNotHasResponse = (axiosError: AxiosError) => !axiosError.response && axiosError.request;
const isRequestNotCancelled = (axiosError: AxiosError) => axiosError.request.status !== 0;

const shouldRetryTokenExpireRequest = (axiosError: AxiosError) => {
  const responseTokenExpired = axiosError.response.status === 401
    || axiosError.response?.data?.code === APIErrorCode.Auth.TOKEN_EXPIRED;
  // @ts-ignore
  const shouldRetry = axiosError.config.useRetry;
  return responseTokenExpired && shouldRetry;
};

const shouldRefreshPermission = (axiosError: AxiosError) => {
  // @ts-ignore
  const shouldRetry = axiosError.config.useRetry;
  return axiosError.response.status === 403 && shouldRetry;
};

const handleRefreshTokenFailed = () => {
  useAuthController.getState()?.actions?.announceSessionExpire();
  resetTempValue();
};

const handleSystemIssue = (axiosError: AxiosError) => {
  console.error(axiosError.request);
  useNetworkStore.getState().actions.checkIsInternetReachable();
  const { isInternetReachable } = useNetworkStore.getState() || {};

  // If device still can connect to internet and request doesn't have response, maybe something went wrong with server
  if (isInternetReachable) {
    useNetworkStore.getState().actions.showSystemIssueThenLogout();
  }
};

/**
 * Flow refresh token and retry:
 * 1. Skip refresh & retry if request is not valid (correct provider and has authorization)
 * 2. Create promise handle response, add request callback to queue while create promise
 * 3. Refresh token. After fresh token success, execute all callback in queue to retry
 * 4. Return promise created to axios for handle response as normal flow
 */
const prepareRefreshTokenAndRetry = async (axiosError: AxiosError) => {
  // @ts-ignore
  switch (axiosError.config?.provider?.name) {
    case apiProviders.bein.name:
    case apiProviders.beinFeed.name:
    case apiProviders.beinNotification.name:
    case apiProviders.beinUpload.name:
      if (!axiosError.config.headers?.Authorization) {
        return Promise.reject(axiosError);
      }
      break;
  }

  const promiseHandleResponseErrorShouldRetry = createPromiseHandleResponseAndAddQueueRetry(axiosError);

  await refreshTokenThenExecuteQueueRetry(axiosError.config.headers.Authorization);

  return promiseHandleResponseErrorShouldRetry;
};

const createPromiseHandleResponseAndAddQueueRetry = (axiosError: AxiosError) => new Promise((resolve, reject) => {
  const requestConfig = { ...axiosError.config };
  delete requestConfig.headers?.Authorization;

  const callbackAfterRefreshToken: UnauthorizedReq = async (refreshTokenSuccess: boolean) => {
    if (!refreshTokenSuccess) {
      return reject(axiosError);
    }
    try {
      const resp = await makeHttpRequest(requestConfig as any);
      return resolve(resp);
    } catch (e) {
      return reject(e);
    }
  };

  unauthorizedReqQueue.push(callbackAfterRefreshToken);
});

export const refreshTokenThenExecuteQueueRetry = async (oldBeinToken: string): Promise<void> => {
  if (isRefreshingToken) {
    console.log('\x1b[36m🐣️ apiRequest refreshTokenThenExecuteQueueRetry refreshing token...\x1b[0m');
    return;
  }

  isRefreshingToken = true;
  const sleepTime = sleepBeforeRetry?.[countRetry] || 0;

  countRetry += 1;
  console.log(`\x1b[36m🐣️ index refreshTokenThenExecuteQueueRetry the ${countRetry} time\x1b[0m`);

  if (countRetry >= sleepBeforeRetry.length) {
    countRetry = 0;
    handleRefreshTokenFailed();
    return;
  }

  // sleep to avoid self ddos
  await timeOut(sleepTime);

  let isSuccess = true;

  try {
    const sessionData = await Auth.currentSession();
    const newToken = sessionData?.getAccessToken().getJwtToken();
    const refreshToken = sessionData?.getRefreshToken().getToken();
    const idToken = sessionData?.getIdToken().getJwtToken();
    const exp = sessionData?.getIdToken().getExpiration();

    if (idToken === oldBeinToken) {
      isSuccess = false;
      isRefreshingToken = false;
      await Auth.currentAuthenticatedUser();
      await refreshTokenThenExecuteQueueRetry(oldBeinToken);
      return;
    }

    console.log('\x1b[32m🐣️ index refreshTokenThenExecuteQueueRetry refresh token success!\x1b[0m');
    countRetry = 0;
    const refreshedToken = {
      newToken, refreshToken, idToken, exp,
    };
    useAuthController.getState()?.actions?.setRefreshedToken(refreshedToken);

    // For sharing data between Group and Chat
    const currentSession = {
      accessToken: newToken, refreshToken, idToken, expiration: exp,
    };
    await updateUserFromSharedPreferences({ currentSession });
  } catch (e) {
    handleRefreshTokenFailed();
    return;
  }

  unauthorizedReqQueue.forEach((callback) => callback(isSuccess));
  unauthorizedReqQueue = [];

  isRefreshingToken = false;
};
