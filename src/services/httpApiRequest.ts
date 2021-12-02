import {Auth} from 'aws-amplify';
import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
import {connect, StreamClient} from 'getstream';
import i18n from 'i18next';
import _ from 'lodash';
import moment from 'moment';
import {Alert, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {put} from 'redux-saga/effects';

import apiConfig, {
  FeedResponseError,
  HttpApiRequestConfig,
  HttpApiResponseFormat,
} from '~/configs/apiConfig';
import Store from '~/store';
import * as modalActions from '~/store/modal/actions';
import {ActionTypes, createAction} from '~/utils';
import {getEnv} from '~/utils/env';

const defaultTimeout = 10000;
const commonHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const _dispatchLogout = () => {
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
  // count retry limit
  countLimitRetry = 0;
  timeEndCountLimit = 0;
  // bein
  unauthorizedReqQueue = [];
  // get stream
  unauthorizedGetStreamReqQueue = [];
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
      if (!error.config.headers.Authorization) {
        return Promise.reject(error);
      }
      break;
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
  await getTokenAndCallBackBein(error.config.headers.Authorization);

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
      if (idToken === oldBeinToken) {
        await Auth.currentAuthenticatedUser(); // TODO: verify when change password kickout
        refreshFailKickOut();
        isSuccess = false;
        return;
      } else {
        _dispatchRefreshTokenSuccess(newToken, refreshToken, idToken);
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

    unauthorizedGetStreamReqQueue.forEach(callback => callback(isSuccess));
    unauthorizedGetStreamReqQueue = [];
    unauthorizedReqQueue.forEach(callback => callback(isSuccess));
    unauthorizedReqQueue = [];
    isRefreshingToken = false;
  }
};

let alertShow = false;
const handleResponseError = async (
  error: AxiosError,
): Promise<HttpApiResponseFormat | unknown> => {
  if (error.response) {
    // @ts-ignore
    if (error.response.status === 401 && error.config.useRetry) {
      return handleRetry(error);
    }
    // @ts-ignore
    switch (error.config?.provider?.name) {
      case apiConfig.providers.bein.name:
        return mapResponseSuccessBein(error.response);
      default:
        return mapResponseSuccessBein(error.response);
    }
  } else if (error.request) {
    console.log('error.request', error.config);
    if (!alertShow) {
      alertShow = true;
      // Alert.alert(i18n.t('error:alert_title'), i18n.t('error:no_internet'), [
      Alert.alert(i18n.t('error:alert_title'), error.message, [
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

/**
 * @param streamClient
 * @param feedSlug
 * @param feedId: id with prefix type. Example: `u-${userId}`, `g-${groupId}`
 * @param funcName
 * @param params
 */
const makeGetStreamRequest = async (
  streamClient: StreamClient,
  feedSlug: 'notification' | 'newsfeed' | 'timeline' | 'draft',
  feedId: string,
  funcName: string,
  ...params: any
) => {
  const user = streamClient.feed(feedSlug, feedId);
  // @ts-ignore
  return user[funcName](...params)
    .then((getStreamResponse: any) => getStreamResponse)
    .catch(async (activitiesError: FeedResponseError) => {
      return handleResponseFailFeedActivity(
        activitiesError,
        streamClient,
        feedSlug,
        feedId,
        funcName,
        ...params,
      );
    });
};

let unauthorizedGetStreamReqQueue: UnauthorizedReq[] = [];
const handleResponseFailFeedActivity = async (
  activitiesError: FeedResponseError,
  streamClient: StreamClient,
  feedSlug: 'notification' | 'newsfeed' | 'timeline' | 'draft',
  feedId: string,
  funcName: any,
  ...params: any
) => {
  if (activitiesError.error.status_code === 403) {
    const newReqPromise = new Promise((resolve, reject) => {
      const callback: UnauthorizedReq = async (success: boolean) => {
        if (!success) {
          return reject(activitiesError);
        }

        try {
          const newStreamClient = connect(
            getEnv('GET_STREAM_API_KEY'),
            getFeedAccessToken(),
            getEnv('GET_STREAM_APP_ID'),
            {location: 'singapore'},
          );
          const resp = await makeGetStreamRequest(
            newStreamClient,
            feedSlug,
            feedId,
            funcName,
            ...params,
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
    await getTokenAndCallBackBein('');

    // next
    return newReqPromise;
  }
  return activitiesError;
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
    if (data.code != 200) {
      return false;
    }

    const {accessToken: feedAccessToken, subscribeToken: notiSubscribeToken} =
      data.data?.stream;

    return {
      feedAccessToken,
      notiSubscribeToken,
    };
  } catch (e) {
    console.log('getAuthTokens failed', e);
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

const makePushTokenRequest = async (deviceToken: string) => {
  const deviceName = await DeviceInfo.getDeviceName();
  return makeHttpRequest(
    apiConfig.App.pushToken(
      deviceToken,
      Platform.OS,
      DeviceInfo.getBundleId(),
      DeviceInfo.getDeviceType(),
      deviceName,
    ),
  );
};

const makeRemovePushTokenRequest = async (authToken: string) => {
  const deviceName = await DeviceInfo.getDeviceName();
  const requestConfig = apiConfig.App.removePushToken(
    authToken,
    Platform.OS,
    DeviceInfo.getBundleId(),
    DeviceInfo.getDeviceType(),
    deviceName,
  );
  const axiosInstance = axios.create();
  axiosInstance.defaults.timeout = requestConfig.timeout;
  return axiosInstance(requestConfig);
};

// helper function to make subscription to get stream and run callback when client receive new activity
const subscribeGetstreamFeed = (
  streamClient: StreamClient,
  feedSlug: 'notification' | 'newsfeed' | 'timeline' | 'draft',
  feedId: string,
  // @ts-ignore
  callback,
) => {
  // just a log when client subscribe the notification feed successfully
  const subscribeSuccessCallback = () => {
    console.log('now listening to changes in realtime');
  };

  // just a log when client subscribe the notification feed failed
  // @ts-ignore
  const subscribeFailCallback = data => {
    console.log('something went wrong:', data);
  };

  // subscribe notification feed to get realtime activity
  const subscription = streamClient.feed(feedSlug, feedId).subscribe(callback);
  subscription.then(subscribeSuccessCallback, subscribeFailCallback);
  return subscription;
};

export {
  makeGetStreamRequest,
  makeHttpRequest,
  makePushTokenRequest,
  makeRemovePushTokenRequest,
  mapResponseSuccessBein,
  handleResponseFailFeedActivity,
  refreshAuthTokens,
  subscribeGetstreamFeed,
};
