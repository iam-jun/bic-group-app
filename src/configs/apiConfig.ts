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
  getStream: {
    url: 'http://52.15.139.185:3000/',
    name: 'GetStream',
  },
};

const Upload = {
  uploadFile: (
    type: any,
    data: FormData,
    onUploadProgress?: (progressEvent: any) => void,
  ): HttpApiRequestConfig => {
    const uploadEndPoint: any = {
      userAvatar: 'upload/user-avatar',
      userCover: 'upload/user-cover',
      groupAvatar: 'upload/group-avatar',
      groupCover: 'upload/group-cover',
      postImage: 'upload/post-image',
      postVideo: 'upload/post-video',
      postFile: 'upload/post-file',
      commentImage: 'upload/comment-image',
      commentVideo: 'upload/comment-video',
      commentFile: 'upload/comment-file',
    };

    const url = `${providers.bein.url}${uploadEndPoint[type]}`;
    return {
      url,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      useRetry: false,
      provider: providers.bein,
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
  pushToken: (
    deviceToken: string,
    deviceOS: string,
    appBundleId: string,
    deviceType: string,
    deviceName: string,
  ): HttpApiRequestConfig => {
    return {
      url: `${providers.bein.url}notification/token`,
      method: 'post',
      provider: providers.bein,
      useRetry: true,
      data: {
        token: deviceToken,
        device_os: deviceOS,
        app_name: appBundleId,
        device_type: deviceType,
        device_name: deviceName,
      },
    };
  },
  removePushToken: (
    authToken: string,
    deviceOS: string,
    appBundleId: string,
    deviceType: string,
    deviceName: string,
  ): HttpApiRequestConfig => {
    return {
      url: `${providers.bein.url}notification/token`,
      method: 'delete',
      provider: providers.bein,
      useRetry: false,
      timeout: 5000,
      headers: {
        Authorization: authToken,
      },
      data: {
        device_os: deviceOS,
        app_name: appBundleId,
        device_type: deviceType,
        device_name: deviceName,
      },
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
      params,
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
  Upload,
};
