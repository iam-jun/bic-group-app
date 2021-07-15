import axios, {AxiosError, AxiosRequestConfig, CancelTokenSource} from 'axios';
import _ from 'lodash';
import {Alert} from 'react-native';
import Config from 'react-native-config';
import i18n from 'i18next';

import tokenService, {
  CustomAxiosError,
  CustomAxiosRequestConfig,
  CustomAxiosResponse,
  RestfulResponse,
} from '~/services/tokenService';

const commonHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const interceptorsRequestSuccess = (config: CustomAxiosRequestConfig) => {
  console.log(
    '%c ================ REQUEST ================',
    'background: #ffff00; color: #000',
    config.url,
    config.method?.toUpperCase(),
    config,
  );
  return config;
};

const interceptorsResponseSuccess = (response: CustomAxiosResponse) => {
  console.log(
    '%c ================ RESPONSE SUCCESS ================',
    'background: #66ff33; color: #000',
    response.config.url,
    response.config.method?.toUpperCase(),
    response,
  );
  return handlerResponse(response);
};

const interceptorsResponseError = async (error: CustomAxiosError) => {
  console.log(
    '%c ================ RESPONSE ERROR ================',
    'background: red; color: #fff',
    error.config.url,
    error.config.method?.toUpperCase(),
    error,
  );
  const newError = handlerError(error);

  if (error.config && error.config.isHandleUnauthorized) {
    return tokenService.retryHandler(newError, error.config);
  }

  return Promise.reject(newError);
};

const handlerResponse = (response: CustomAxiosResponse) => {
  const newResponse = {...response};
  // @ts-ignore
  delete newResponse.config;
  delete newResponse.headers;
  delete newResponse.request;
  if (_.isEmpty(newResponse.data.data)) {
    // make sure app not crash when data is null on some screen (eg: detail,...)
    // careful when load paging null
    newResponse.data.data = {};
  }
  return newResponse;
};

const handlerError = (error: CustomAxiosError): RestfulResponse => {
  let alertShow = false;
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    // console.log("handlerError Response", error.response)
    const newError: CustomAxiosResponse = {...error.response};
    if (newError.config) {
      // @ts-ignore
      delete newError.config;
    }
    if (newError.headers) {
      delete newError.headers;
    }
    if (newError.request) {
      delete newError.request;
    }

    return newError;
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    // console.log("handlerError Request", error.request)
    const newError: RestfulResponse = {
      data: {
        // message: i18n.t('Message.noInternet'),
        message: i18n.t('error:no_internet'),
      },
      status: error.request.status,
    };
    if (!alertShow) {
      alertShow = true;
      // Alert.alert(i18n.t('Common.notice'), i18n.t('Message.noInternet'), [
      Alert.alert(i18n.t('error:alert_title'), i18n.t('error:no_internet'), [
        {
          onPress: () => {
            alertShow = false;
          },
        },
      ]);
    }

    return newError;
  } else {
    // Something happened in setting up the request that triggered an Error
    // console.log("handlerError Setting Up", error)
    return {data: {...error}, status: -600};
  }
};

const getErrorMessage = (error: CustomAxiosError) => {
  if (error.clientMessage) {
    return error.clientMessage;
  }

  const data = _.get(error, 'data', {});

  switch (data.status_code) {
    case 401:
      return i18n.t('error:http:401');
    default:
      return _.get(data, 'errors.message', i18n.t('error:http:unknown'));
  }
};

const createRequest = async (config: AxiosRequestConfig) => {
  // set base url
  const headers = {...commonHeaders, ...config.headers};
  const newConfig = {baseURL: Config.BASE_API_URL, ...config, headers};

  // create a axios instance
  const axiosInstance = axios.create();
  axiosInstance.defaults.timeout = parseInt(Config.REQUEST_TIME_OUT, 10);
  axiosInstance.interceptors.request.use(interceptorsRequestSuccess, undefined);
  axiosInstance.interceptors.response.use(
    interceptorsResponseSuccess,
    interceptorsResponseError,
  );

  // return
  return axiosInstance(newConfig);
};

const request = async (config: AxiosRequestConfig) => {
  // Authentication
  const commonAuthHeader = tokenService.getCommonAuthHeader();
  const headers = {...config.headers, ...commonAuthHeader};

  // using retrier
  const newConfig = {...config, headers, isHandleUnauthorized: true};

  // request
  return createRequest(newConfig);
};

const requestWithoutToken = async (config: AxiosRequestConfig) => {
  // request
  return createRequest(config);
};

// Cancel request
const CancelToken = axios.CancelToken;
const sourceCancel = (): CancelTokenSource => {
  return CancelToken.source();
};

const cancelRequest = (source: CancelTokenSource, message: string = '') => {
  if (source) {
    source.cancel(message);
  }
};

const isCancel = (error: AxiosError) => {
  return axios.isCancel(error);
};

export default {
  request,
  requestWithoutToken,

  cancelRequest,
  sourceCancel,
  isCancel,

  getErrorMessage,
};
