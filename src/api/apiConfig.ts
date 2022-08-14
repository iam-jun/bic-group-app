import { AxiosRequestConfig } from 'axios';

import getEnv from '~/utils/env';
import { IParamsGetUsers } from '~/interfaces/IAppHttpRequest';
import appConfig from '../configs/appConfig';

export const apiProviders = {
  bein: {
    url: getEnv('BEIN_API'),
    name: 'Bein',
  },
  beinFeed: {
    url: getEnv('BEIN_FEED'),
    name: 'BeinFeed',
  },
  beinNotification: {
    url: `${getEnv('BEIN_NOTIFICATION')}`,
    name: 'BeinNotification',
  },
  beinUpload: {
    url: `${getEnv('BEIN_UPLOAD')}`,
    name: 'BeinUpload',
  },
};

const Upload = {
  createVideoId: (): HttpApiRequestConfig => ({
    url: `${apiProviders.beinUpload.url}videos`,
    method: 'post',
    provider: apiProviders.beinUpload,
    useRetry: true,
  }),
  uploadVideo: (
    id: string,
    type: any,
    data: FormData,
    onUploadProgress?: (progressEvent: any) => void,
    abortSignal?: AbortSignal,
  ): HttpApiRequestConfig => ({
    url: `${apiProviders.beinUpload.url}videos/${id}`,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    useRetry: true,
    provider: apiProviders.beinUpload,
    onUploadProgress,
    data,
    signal: abortSignal,
  }),
  uploadImage: (
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
      url = `${apiProviders.bein.url}${groupUploadEndPoint[type]}`;
      provider = apiProviders.bein;
    } else if (uploadEndPoint[type]) {
      url = `${apiProviders.beinUpload.url}${uploadEndPoint[type]}`;
      provider = apiProviders.beinUpload;
    } else {
      // upload bein feed
      url = `${apiProviders.beinFeed.url}media`;
      provider = apiProviders.beinFeed;
      data.append(
        'upload_type', type,
      );
    }

    return {
      url,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      useRetry: true,
      provider,
      onUploadProgress,
      data,
    };
  },
  createFileId: (uploadType: string): HttpApiRequestConfig => {
    const type = uploadType.split('_')[1];
    return {
      url: `${apiProviders.beinUpload.url}${type}s`,
      method: 'post',
      provider: apiProviders.beinUpload,
      useRetry: true,
    };
  },
  uploadFile: (
    id: string,
    uploadType: string,
    data: FormData,
    onUploadProgress?: (progressEvent: any) => void,
    abortSignal?: AbortSignal,
  ): HttpApiRequestConfig => {
    const type = uploadType.split('_')[1];
    return {
      url: `${apiProviders.beinUpload.url}${type}s/${id}`,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      useRetry: true,
      provider: apiProviders.beinUpload,
      data,
      signal: abortSignal,
      timeout: appConfig.fileUploadTimeout,
      onUploadProgress,
    };
  },
};

const App = {
  info: (): HttpApiRequestConfig => ({
    url: `${apiProviders.bein.url}hello/bein`,
    method: 'get',
    provider: apiProviders.bein,
    useRetry: true,
  }),
  pushToken: (
    deviceToken: string, deviceId: string,
  ): HttpApiRequestConfig => ({
    url: `${apiProviders.beinNotification.url}device-tokens`,
    method: 'post',
    provider: apiProviders.beinNotification,
    useRetry: true,
    data: {
      token: deviceToken,
      deviceId,
    },
  }),
  removePushToken: (deviceId: string): HttpApiRequestConfig => ({
    url: `${apiProviders.beinNotification.url}device-tokens/${deviceId}`,
    method: 'delete',
    provider: apiProviders.beinNotification,
    useRetry: false,
    timeout: 5000,
  }),
  getLinkPreview: (link: string): HttpApiRequestConfig => ({
    url: `${apiProviders.bein.url}link-preview/${link}`,
    method: 'get',
    provider: apiProviders.bein,
    useRetry: true,
  }),
  getUsers: (params: IParamsGetUsers): HttpApiRequestConfig => ({
    url: `${apiProviders.bein.url}users`,
    method: 'get',
    useRetry: true,
    provider: apiProviders.bein,
    params: {
      ...params,
      key: params?.key?.trim?.() ? params.key : undefined,
    },
  }),
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

const ApiConfig = {
  providers: apiProviders,
  App,
  Upload,
}

export default ApiConfig;
