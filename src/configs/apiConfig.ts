import {AxiosRequestConfig} from 'axios';
import {
  ICreateRoomReq,
  IGetGroupReq,
  IGetGroupRolesReq,
  IPaginationParams,
  IReadSubscription,
  ISendMessageReq,
} from '~/interfaces/IChatHttpRequest';
import {getEnv} from '~/utils/env';

const providers = {
  bein: {
    url: getEnv('BEIN_API'),
    name: 'Bein',
  },
  chat: {
    url: getEnv('ROCKET_CHAT_API'),
    name: 'RocketChat',
  },
  getStream: {
    url: 'http://52.15.139.185:3000/',
    name: 'GetStream',
  },
};

const Chat = {
  groups: (params: IPaginationParams): HttpApiRequestConfig => {
    return {
      url: `${providers.chat.url}groups.list`,
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
  users: (params: IPaginationParams & {params: any}) => {
    return {
      url: `${providers.chat.url}users.list`,
      method: 'get',
      useRetry: true,
      provider: providers.chat,
      params,
    };
  },
  messages: (params: IPaginationParams & {roomId: string}) => {
    return {
      url: `${providers.chat.url}groups.history`,
      method: 'get',
      useRetry: true,
      provider: providers.chat,
      params,
    };
  },
  members: (
    params: IPaginationParams & {roomId: string},
  ): HttpApiRequestConfig => {
    return {
      url: `${providers.chat.url}users.list`,
      method: 'get',
      useRetry: true,
      provider: providers.chat,
      params,
    };
  },
  roles: (params: IGetGroupRolesReq): HttpApiRequestConfig => {
    return {
      url: `${providers.chat.url}groups.roles`,
      method: 'get',
      useRetry: true,
      provider: providers.chat,
      params,
    };
  },
  subcriptions: (): HttpApiRequestConfig => {
    return {
      url: `${providers.chat.url}subscriptions.get`,
      method: 'get',
      useRetry: true,
      provider: providers.chat,
    };
  },
  readSubcriptions: (data: IReadSubscription): HttpApiRequestConfig => {
    return {
      url: `${providers.chat.url}subscriptions.read`,
      method: 'post',
      useRetry: true,
      provider: providers.chat,
      data,
    };
  },
  sendMessage: (data: ISendMessageReq): HttpApiRequestConfig => {
    return {
      url: `${providers.chat.url}chat.sendMessage`,
      method: 'post',
      useRetry: false,
      provider: providers.chat,
      data,
    };
  },
  groupInfo: (params: IGetGroupReq): HttpApiRequestConfig => {
    return {
      url: `${providers.chat.url}groups.info`,
      method: 'get',
      useRetry: true,
      provider: providers.chat,
      params,
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
  tokens: (): HttpApiRequestConfig => {
    return {
      url: `${providers.bein.url}auth/token`,
      method: 'get',
      provider: providers.bein,
      useRetry: true,
    };
  },
  pushToken: (
    deviceToken: string,
    deviceOS: string,
    chatToken: string,
    chatUserId: string,
    appBundleId: string,
    deviceType: string,
    deviceName: string,
  ): HttpApiRequestConfig => {
    return {
      url: `${providers.bein.url}notification/token`,
      method: 'post',
      provider: providers.bein,
      useRetry: true,
      headers: {
        'X-Auth-Token': chatToken,
        'X-User-Id': chatUserId,
      },
      data: {
        token: deviceToken,
        device_os: deviceOS,
        app_name: appBundleId,
        device_type: deviceType,
        device_name: deviceName,
      },
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
