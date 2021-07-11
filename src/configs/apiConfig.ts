import {AxiosRequestConfig} from "axios"
import Config from 'react-native-config'

const App = {
  info: () => {
    return {
      url: `${Config.BASE_API_URL}get_app_info`,
      method: 'get',
    }
  },
}

const Auth = {
  // TODO:
  refreshToken: (refreshToken: string): AxiosRequestConfig => {
    const data = new FormData()
    data.append('token', refreshToken)
    return {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'multipart/form-data',
      },
      url: '/oauth2/refresh-token',
      method: 'post',
      data,
    }
  },
}

export default {
  App,
  Auth,
}
