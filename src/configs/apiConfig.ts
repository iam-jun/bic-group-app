import {AxiosRequestConfig} from 'axios';
import {ICreateRoomReq, IPaginationParams} from '~/interfaces/IHttpRequest';

const providers = {
  bein: {
    url: 'http://13.212.9.73:3000/',
    name: 'Bein',
  },
  chat: {
    url: 'https://rockettest.bein.group/api/v1/',
    name: 'RocketChat',
  },
  getStream: {
    url: 'http://52.15.139.185:3000/',
    name: 'GetStream',
  },
};

const Chat = {
  getRooms: (params: IPaginationParams): HttpApiRequestConfig => {
    return {
      url: `${providers.chat.url}groups.listAll`,
      method: 'get',
      useRetry: true,
      provider: providers.chat,
      params,
    };
  },
  createRoom: (data: ICreateRoomReq): HttpApiRequestConfig => {
    return {
      url: `${providers.chat.url}groups.create`,
      method: 'post',
      useRetry: true,
      provider: providers.chat,
      data,
    };
  },
};

const App = {
  info: (): HttpApiRequestConfig => {
    return {
      url: `${providers.bein.url}hello/bein`,
      method: 'get',
      provider: providers.bein,
      useRetry: true,
    };
  },
  users: (): HttpApiRequestConfig => {
    return {
      url: `${providers.bein.url}users`,
      method: 'get',
      provider: providers.bein,
      useRetry: false,
    };
  },
  tokens: (): HttpApiRequestConfig => {
    return {
      url: `${providers.bein.url}auth/token`,
      method: 'get',
      provider: providers.bein,
      useRetry: true,
    };
  },
};

export interface HttpApiRequestConfig extends AxiosRequestConfig {
  provider: Provider;
  useRetry: boolean;
}

export interface Provider {
  name: string;
  url: string;
}

export interface HttpApiResponseFormat {
  code: number;
  data?: any;
  meta?: any;
}

export interface FeedResponseError {
  message: string | any;
  error: {
    detail: string;
    status_code: number;
    code: number;
    exception: any;
    duration: any;
    more_info: any;
  };
  response: any;
}

export default {
  providers,

  App,
  Chat,
};
