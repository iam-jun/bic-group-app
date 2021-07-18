import {CustomAxiosRequestConfig} from '~/services/tokenService';
import awsExport from '../../aws-exports';

const providers = {
  Default: {
    name: 'Bein',
    url: 'http://52.15.139.185:3000/api/',
  },
  Chat: {
    name: 'RocketChat',
    url: 'http://52.15.139.185:3000/api/',
  },
  GetStream: {
    name: 'GetStream',
    url: 'http://52.15.139.185:3000/api/',
  },
  Auth: {
    name: 'Auth',
    url: `http://${awsExport.oauth.domain}/`,
  },
};

const App = {
  info: (): CustomAxiosRequestConfig => {
    return {
      url: `${providers.Default.url}get_app_info`,
      method: 'get',
      provider: providers.Default.name,
    };
  },
};

const Auth = {
  // TODO:
  refreshToken: (refreshToken: string): CustomAxiosRequestConfig => {
    const data = new FormData();
    data.append('token', refreshToken);
    return {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'multipart/form-data',
      },
      url: `${providers.Auth.url}oauth2/token`,
      method: 'post',
      data,
      provider: providers.Auth.name,
    };
  },
  tokens: (awsToken: string): CustomAxiosRequestConfig => {
    return {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'multipart/form-data',
        Authorization: `Bearer ${awsToken}`,
        url: `${providers.Default.url}user/tokens`,
        method: 'post',
        provider: providers.Default.name,
      },
    };
  },
};

export default {
  providers,

  App,
  Auth,
};
