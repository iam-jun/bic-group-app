import { Method } from 'axios';
import { apiProviders, HttpApiRequestConfig } from '~/api/apiConfig';
import appConfig from '~/configs/appConfig';
import { IFilePicked } from '~/interfaces/common';

const provider = apiProviders.beinUpload;
const defaultConfig = {
  provider,
  method: 'get' as Method,
  useRetry: true,
};

export const uploadApiConfig = {
  createVideoId: (): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}videos`,
    method: 'post',
  }),
  uploadVideo: (
    id: string,
    type: any,
    data: FormData,
    onUploadProgress?: (progressEvent: any) => void,
    abortSignal?: AbortSignal,
  ): HttpApiRequestConfig => ({
    ...defaultConfig,
    url: `${provider.url}videos/${id}`,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
    data,
    signal: abortSignal,
  }),
  uploadImage: (
    type: any,
    file: IFilePicked,
    onUploadProgress?: (progressEvent: any) => void,
  ): HttpApiRequestConfig => {
    const data = new FormData();
    data.append('file', file as any, file.name);
    data.append(
      'description',
      JSON.stringify({
        size: file.size,
        type: file.type,
      }),
    );

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
    let _provider: any;

    if (groupUploadEndPoint[type]) {
      // upload bein group
      url = `${apiProviders.bein.url}${groupUploadEndPoint[type]}`;
      _provider = apiProviders.bein;
    } else if (uploadEndPoint[type]) {
      url = `${provider.url}${uploadEndPoint[type]}`;
      _provider = provider;
    } else {
      // upload bein feed
      url = `${apiProviders.beinFeed.url}media`;
      _provider = apiProviders.beinFeed;
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
      provider: _provider,
      onUploadProgress,
      data,
    };
  },
  createFileId: (uploadType: string): HttpApiRequestConfig => {
    const type = uploadType.split('_')[1];
    return {
      ...defaultConfig,
      url: `${provider.url}${type}s`,
      method: 'post',
    };
  },
  uploadFile: (
    id: string,
    uploadType: string,
    file: IFilePicked,
    abortSignal?: AbortSignal,
    onUploadProgress?: (progressEvent: any) => void,
  ): HttpApiRequestConfig => {
    const type = uploadType.split('_')[1];

    const data = new FormData();
    data.append('file', file as any, file.name);
    data.append('upload_type', uploadType);

    return {
      ...defaultConfig,
      url: `${provider.url}${type}s/${id}`,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data,
      signal: abortSignal,
      timeout: appConfig.fileUploadTimeout,
      onUploadProgress,
    };
  },
};

const uploadApi = {};

export default uploadApi;
