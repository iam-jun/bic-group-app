import { Alert } from 'react-native'
import axios, {AxiosRequestConfig, AxiosResponse, AxiosError} from 'axios'
import _ from 'lodash'
import Config from "react-native-config"
import { Api, I18n } from '../helpers'

// TODO: replace Api with Config env +


const commonHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

const interceptorsRequestSuccess = (config: AxiosRequestConfig) => {
  console.log(
    '%c ================ REQUEST ================',
    'background: #ffff00; color: #000',
    config.needBaseUrl ? Config.BASE_URL + config.url : config.url,
    config.method.toUpperCase(),
    config,
  )
  return config
}

const interceptorsResponseSuccess = (response: AxiosResponse) => {
  console.log(
    '%c ================ RESPONSE SUCCESS ================',
    'background: #66ff33; color: #000',
    response.config.needBaseUrl ? Api.BASE_URL + response.config.url : response.config.url,
    response.config.method.toUpperCase(),
    response,
  )
  return handlerResponse(response)
}

const interceptorsResponseError = async (error: AxiosError) => {
  console.log(
    '%c ================ RESPONSE ERROR ================',
    'background: red; color: #fff',
    error.config.needBaseUrl ? Api.BASE_URL + error.config.url : error.config.url,
    error.config.method.toUpperCase(),
    error,
  )
  const newError = handlerError(error)

  if (error.config && error.config.usingRetrier === true) {
    const OAuthHandler = require('./OAuthService').default
    return OAuthHandler.retryHandler(newError, error.config)
  }

  return Promise.reject(newError)
}

const handlerResponse = (response: AxiosResponse) => {
  const newResponse = { ...response }
  delete newResponse.config
  delete newResponse.headers
  delete newResponse.request
  if (_.isEmpty(newResponse.data.data)) {
    // make sure app not crash when data is null on some screen (eg: detail,...)
    // careful when load paging null
    newResponse.data.data = {}
  }
  return newResponse
}

const handlerError = (error: AxiosError) => {
  let alertShow = false
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    // console.log("handlerError Response", error.response)
    const newError = { ...error.response }
    if (newError.config) {
      delete newError.config
    }
    if (newError.headers) {
      delete newError.headers
    }
    if (newError.request) {
      delete newError.request
    }

    return newError
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    // console.log("handlerError Request", error.request)
    const newError = {
      data: {
        message: I18n.t('Message.noInternet'),
      },
      status: error.request.status,
    }
    if (!alertShow) {
      alertShow = true
      Alert.alert(I18n.t('Common.notice'), I18n.t('Message.noInternet'), [
        {
          onPress: () => {
            alertShow = false
          },
        },
      ])
    }

    return newError
  } else {
    // Something happened in setting up the request that triggered an Error
    // console.log("handlerError Setting Up", error)
    let newError = { data: {}, status: -600 }
    if (!error.data) {
      newError = { ...newError, data: { ...error } }
    } else {
      newError = { ...newError, ...error }
    }

    return newError
  }
}

const getErrorMessage = (error: AxiosError) => {
  if (error.clientMessage) {
    return error.clientMessage
  }

  const data = _.get(error, 'data', {})

  switch (data.status_code) {
    case 401:
      return I18n.t('Message.401')
    // case 422: // this case show message response from Server!
    //   return I18n.t('Message.422')
    default:
      return _.get(data, 'errors.message', I18n.t('Message.unknown'))
  }
}

const createRequest = async (config: AxiosRequestConfig) => {
  // set base url
  const headers = { ...commonHeaders, ...config.headers }
  const newConfig = { baseURL: Api.BASE_URL, ...config, headers }

  // base url
  if (newConfig.needBaseUrl === false) {
    delete newConfig.baseURL
  }

  // create a axios instance
  const axiosInstance = axios.create()
  axiosInstance.defaults.timeout = Api.TIME_OUT
  axiosInstance.interceptors.request.use(interceptorsRequestSuccess, null)
  axiosInstance.interceptors.response.use(interceptorsResponseSuccess, interceptorsResponseError)

  // return
  return axiosInstance(newConfig)
}

const request = async (config: AxiosRequestConfig) => {
  // Authentication
  const OAuthHandler = require('./OAuthService').default
  // const authen_header = OAuthHandler.authenticationHeader()
  const commonAuthHeader = OAuthHandler.getCommonAuthHeader()
  const headers = { ...config.headers, ...commonAuthHeader }

  // using retrier
  const newConfig = { ...config, headers, usingRetrier: true }

  // request
  return createRequest(newConfig)
}

const requestWithoutToken = async (config: AxiosRequestConfig) => {
  // request
  return createRequest(config)
}

// Cancel request
const CancelToken = axios.CancelToken
const sourceCancel = () => {
  return CancelToken.source()
}

const cancelRequest = (source, message) => {
  if (source) {
    source.cancel(message)
  }
}

const isCancel = (error: AxiosError) => {
  return axios.isCancel(error)
}

export default {
  request,
  requestWithoutToken,
  cancelRequest,
  sourceCancel,
  isCancel,
  getErrorMessage,
}
