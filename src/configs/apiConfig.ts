import {AxiosRequestConfig} from 'axios';

import {getEnv} from '~/utils/env';
import {IParamsGetUsers} from '~/interfaces/IAppHttpRequest';

const providers = {
  bein: {
    url: getEnv('BEIN_API'),
    name: 'Bein',
  },
  beinFeed: {
    url: getEnv('BEIN_FEED'),
    name: 'BeinFeed',
  },
  beinNotification: {
    url: `${getEnv('BEIN_NOTIFICATION')}api/v1/`,
    name: 'BeinNotification',
  },
};

const Upload = {
  uploadFile: (
    type: any,
    data: FormData,
    onUploadProgress?: (progressEvent: any) => void,
  ): HttpApiRequestConfig => {
    const uploadEndPoint: any = {
      user_avatar: 'upload/user-avatar',
      user_cover: 'upload/user-cover',
      group_avatar: 'upload/group-avatar',
      group_cover: 'upload/group-cover',
    };

    let url: string;
    let provider: any;

    if (uploadEndPoint[type]) {
      // upload bein group
      url = `${providers.bein.url}${uploadEndPoint[type]}`;
      provider = providers.bein;
    } else {
      // upload bein feed
      url = `${providers.beinFeed.url}api/v1/media`;
      provider = providers.beinFeed;
      data.append('uploadType', type);
    }

    return {
      url,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      useRetry: true,
      provider,
      onUploadProgress: onUploadProgress,
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
  tokens: (): HttpApiRequestConfig => {
    return {
      url: `${providers.bein.url}auth/token`,
      method: 'get',
      provider: providers.bein,
      useRetry: true,
    };
  },
  pushToken: (deviceToken: string, deviceId: string): HttpApiRequestConfig => {
    return {
      url: `${providers.beinNotification.url}device-tokens`,
      method: 'post',
      provider: providers.bein,
      useRetry: true,
      data: {
        token: deviceToken,
        deviceId,
      },
    };
  },
  removePushToken: (deviceId: string): HttpApiRequestConfig => {
    return {
      url: `${providers.beinNotification.url}device-tokens/${deviceId}`,
      method: 'delete',
      provider: providers.bein,
      useRetry: false,
      timeout: 5000,
    };
  },
  getLinkPreview: (link: string): HttpApiRequestConfig => {
    return {
      url: `${providers.bein.url}link-preview/${link}`,
      method: 'get',
      provider: providers.bein,
      useRetry: true,
    };
  },
  getUsers: (params: IParamsGetUsers): HttpApiRequestConfig => {
    return {
      url: `${providers.bein.url}users`,
      method: 'get',
      useRetry: true,
      provider: providers.bein,
      params: {
        ...params,
        key: !!params?.key?.trim?.() ? params.key : undefined,
      },
    };
  },
};

const Chat = {
  init: (): HttpApiRequestConfig => {
    return {
      url: `${providers.bein.url}chat/channels/unread`,
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
  code: string | number;
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
  Upload,
  Chat,
};
