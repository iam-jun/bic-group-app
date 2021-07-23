import {Auth} from 'aws-amplify';
import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
import {StreamClient} from 'getstream';
import i18n from 'i18next';
import _ from 'lodash';
import {Alert} from 'react-native';

import apiConfig, {
  FeedResponseError,
  HttpApiRequestConfig,
  HttpApiResponseFormat,
} from '~/configs/apiConfig';
import Store from '~/store';
import {ActionTypes, createAction} from '~/utils';

const defaultTimeout = 10000;
const commonHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const _dispatchLogout = () => {
  Store.store.dispatch(createAction(ActionTypes.UnauthorizedLogout));
};

const _dispatchRefreshTokenSuccess = (
  newToken: string,
  refreshToken: string,
  idToken: string,
) => {
  Store.store.dispatch(
    createAction(ActionTypes.RefreshTokenSuccessBein, {
      newToken,
      refreshToken,
      idToken,
    }),
  );
};

const dispatchStoreAuthTokens = (
  chatUserId: string,
  chatAccessToken: string,
  feedAccessToken: string,
) => {
  Store.store.dispatch(
    createAction(ActionTypes.SaveAuthTokens, {
      chatUserId,
      chatAccessToken,
      feedAccessToken,
    }),
  );
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

const getBeinAccessToken = (): string => {
  return _.get(
    Store.getCurrentUser(),
    'signInUserSession.accessToken.jwtToken',
    '',
  );
};

const getChatAccessToken = (): string => {
  return _.get(Store.getCurrentAuth(), 'chat.accessToken', '');
};

const getFeedAccessToken = (): string => {
  return _.get(Store.getCurrentAuth(), 'feed.accessToken', '');
};

// retryHandler
interface UnauthorizedReq {
  (success: boolean): Promise<void>;
}

let unauthorizedReqQueue: UnauthorizedReq[] = [];
const handleRetryBein = async (error: AxiosError) => {
  // check if error is not 401 or is not unauthorized type
  // check if orgConfig contain Authorization key
  if (!error.config.headers.Authorization) {
    return Promise.reject(error);
  }

  //================== 401 Unauthorized ==================

  // create new promise
  const newReqPromise = new Promise((resolve, reject) => {
    const newOrgConfig = {...error.config};
    delete newOrgConfig.headers.Authorization;

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
  await getTokenAndCallBackBein();

  // next
  return newReqPromise;
};

// get refresh token
let isRefreshingToken = false;
const getTokenAndCallBackBein = async (): Promise<void> => {
  if (!isRefreshingToken) {
    isRefreshingToken = true;
    let isSuccess = true;

    const oldToken = getBeinAccessToken();
    const sessionData = await Auth.currentSession();
    const newToken = sessionData?.getAccessToken().getJwtToken();
    const refreshToken = sessionData?.getRefreshToken().getToken();
    const idToken = sessionData?.getIdToken().getJwtToken();
    if (newToken === oldToken) {
      _dispatchLogout();
      isSuccess = false;
    }
    _dispatchRefreshTokenSuccess(newToken, refreshToken, idToken);

    unauthorizedReqQueue.forEach(callback => callback(isSuccess));
    unauthorizedReqQueue = [];
    isRefreshingToken = false;
  }
};

const handleResponseErrorBein = async (
  error: AxiosError,
): Promise<HttpApiResponseFormat | unknown> => {
  let alertShow = false;
  if (error.response) {
    // @ts-ignore
    if (error.response.status === 401 && error.config.useRetry) {
      // if (error.config.useRetry) {
      return handleRetryBein(error);
    }

    const dataFromServer = error.response.data;
    return {
      code: dataFromServer.code,
      data: dataFromServer.data,
      meta: dataFromServer.meta,
    };
  } else if (error.request) {
    if (!alertShow) {
      alertShow = true;
      Alert.alert(i18n.t('error:alert_title'), i18n.t('error:no_internet'), [
        {
          onPress: () => {
            alertShow = false;
          },
        },
      ]);
    }

    return {
      code: error.request.status, // request made, no response
      data: null,
      meta: {
        message: i18n.t('error:no_internet'),
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

const handleResponseSuccessBein = (
  response: AxiosResponse,
): HttpApiResponseFormat => {
  return {
    code: response.data.code,
    data: response.data.data,
    meta: response.data.meta,
  };
};

const interceptorsRequestSuccessBein = (requestConfig: AxiosRequestConfig) => {
  logInterceptorsRequestSuccess(requestConfig);
  return requestConfig;
};

const interceptorsResponseSuccessBein = (response: AxiosResponse) => {
  logInterceptorsResponseSuccess(response);
  return response;
};

const interceptorsResponseErrorBein = async (error: AxiosError) => {
  logInterceptorsResponseError(error);
  return handleResponseErrorBein(error);
};

const makeGetStreamRequest = async (
  streamClient: StreamClient,
  feedSlug: string,
  userId: string,
  funcName: string,
  params: any,
) => {
  const user = streamClient.feed(feedSlug, userId);
  // @ts-ignore
  return user[funcName](params)
    .then((getStreamResponse: any) => getStreamResponse)
    .catch(async (activitiesError: FeedResponseError) => {
      return handleResponseFailFeedActivity(
        activitiesError,
        streamClient,
        feedSlug,
        userId,
        funcName,
        params,
      );
    });
};

let unauthorizedGetStreamReqQueue: UnauthorizedReq[] = [];
const handleResponseFailFeedActivity = async (
  activitiesError: FeedResponseError,
  streamClient: StreamClient,
  feedSlug: string,
  userId: string,
  funcName: any,
  params: any,
) => {
  if (activitiesError.error.status_code === 403) {
    const newReqPromise = new Promise((resolve, reject) => {
      const callback: UnauthorizedReq = async (success: boolean) => {
        if (!success) {
          return reject(activitiesError);
        }

        try {
          const resp = await makeGetStreamRequest(
            streamClient,
            feedSlug,
            userId,
            funcName,
            params,
          );
          return resolve(resp);
        } catch (e) {
          return reject(e);
        }
      };

      // add callback
      unauthorizedGetStreamReqQueue.push(callback);
    });

    // create request to refresh token
    await refreshAuthTokensAndRetry();

    // next
    return newReqPromise;
  }
  return activitiesError;
};

let isRefreshingAuthTokens = false;
const refreshAuthTokensAndRetry = async () => {
  if (!isRefreshingAuthTokens) {
    isRefreshingAuthTokens = true;
    const isRefreshSuccess = await refreshAuthTokens();
    // TODO: handle when cannot refresh token
    unauthorizedGetStreamReqQueue.forEach(callback =>
      callback(isRefreshSuccess),
    );
    unauthorizedGetStreamReqQueue = [];
    isRefreshingAuthTokens = false;
  }
};

const refreshAuthTokens = async () => {
  const dataTokens = await getAuthTokens();
  if (!dataTokens) {
    return false;
  }

  const {chatUserId, chatAccessToken, feedAccessToken} = dataTokens;
  dispatchStoreAuthTokens(chatUserId, chatAccessToken, feedAccessToken);
  return true;
};

const getAuthTokens = async () => {
  try {
    const httpResponse = await makeHttpRequest(apiConfig.App.tokens());
    // @ts-ignore
    const data = handleResponseSuccessBein(httpResponse);
    if (data.code != 200) {
      return false;
    }

    const {userId: chatUserId, accessToken: chatAccessToken} = data.data?.chat;
    const {accessToken: feedAccessToken} = data.data?.stream;

    return {chatUserId, chatAccessToken, feedAccessToken};
  } catch (e) {
    console.log('getAuthTokens failed.');
    return false;
  }
};

const makeHttpRequest = async (requestConfig: HttpApiRequestConfig) => {
  let interceptorRequestSuccess,
    interceptorResponseSuccess,
    interceptorResponseError;

  switch (requestConfig.provider.name) {
    case apiConfig.providers.bein.name:
      interceptorRequestSuccess = interceptorsRequestSuccessBein;
      interceptorResponseSuccess = interceptorsResponseSuccessBein;
      interceptorResponseError = interceptorsResponseErrorBein;
      requestConfig.headers = {
        ...commonHeaders,
        ...requestConfig.headers,
        ...{
          Authorization: getBeinAccessToken(),
        },
      };
      break;
    case apiConfig.providers.chat.name:
      // TODO: refactor
      break;
    case apiConfig.providers.getStream.name:
      // TODO: refactor
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

export {
  makeGetStreamRequest,
  makeHttpRequest,
  getFeedAccessToken,
  getChatAccessToken,
  handleResponseSuccessBein,
  handleResponseFailFeedActivity,
  refreshAuthTokens,
};
