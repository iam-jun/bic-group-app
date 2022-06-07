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
  beinUpload: {
    url: `${getEnv('BEIN_UPLOAD')}`,
    name: 'BeinUpload',
  },
};

const Upload = {
  createVideoId: (): HttpApiRequestConfig => {
    return {
      url: `${providers.beinUpload.url}videos`,
      method: 'post',
      provider: providers.beinUpload,
      useRetry: true,
    };
  },
  uploadVideo: (
    id: string,
    type: any,
    data: FormData,
    onUploadProgress?: (progressEvent: any) => void,
    abortSignal?: AbortSignal,
  ): HttpApiRequestConfig => {
    return {
      url: `${providers.beinUpload.url}videos/${id}`,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      useRetry: true,
      provider: providers.beinUpload,
      onUploadProgress: onUploadProgress,
      data,
      signal: abortSignal,
    };
  },
  uploadFile: (
    type: any,
    data: FormData,
    onUploadProgress?: (progressEvent: any) => void,
  ): HttpApiRequestConfig => {
    const groupUploadEndPoint: any = {
      user_avatar: 'upload/user-avatar',
      user_cover: 'upload/user-cover',
      group_avatar: 'upload/group-avatar',
      group_cover: 'upload/group-cover',
    };

    const uploadEndPoint: any = {
      post_video: 'videos/',
    };

    let url: string;
    let provider: any;

    if (groupUploadEndPoint[type]) {
      // upload bein group
      url = `${providers.bein.url}${groupUploadEndPoint[type]}`;
      provider = providers.bein;
    } else if (uploadEndPoint[type]) {
      url = `${providers.beinUpload.url}${uploadEndPoint[type]}`;
      provider = providers.beinUpload;
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
      provider: providers.beinNotification,
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
      provider: providers.beinNotification,
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
