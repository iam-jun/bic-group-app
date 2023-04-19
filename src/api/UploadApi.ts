import { Method } from 'axios';
import { apiProviders, HttpApiRequestConfig } from '~/api/apiConfig';
import appConfig from '~/configs/appConfig';
import { IFilePicked } from '~/interfaces/common';
import { ICreateImageIdData, IUploadImageS3Params, ResourceUploadType } from '~/interfaces/IUpload';
import { makeHttpRequest } from './apiRequest';

const provider = apiProviders.beinUpload;
const defaultConfig = {
  provider,
  method: 'get' as Method,
  useRetry: true,
};

export const uploadApiConfig = {
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
  createImageId: (params?: ICreateImageIdData): HttpApiRequestConfig => {
    return {
      ...defaultConfig,
      url: `${provider.url}images`,
      method: 'post',
      data: params,
    };
  },
  uploadImagetToS3: (
    params: IUploadImageS3Params,
    onUploadProgress: (progressEvent: any) => void,
  ): HttpApiRequestConfig => {
    const data: any = new FormData();

    data.append("key", params.presignedPostFields?.key);
    data.append("bucket", params.presignedPostFields?.bucket);
    data.append("X-Amz-Algorithm", params.presignedPostFields?.xAmzAlgorithm);
    data.append("X-Amz-Credential", params.presignedPostFields?.xAmzCredential);
    data.append("X-Amz-Date", params.presignedPostFields?.xAmzDate);
    data.append("X-Amz-Security-Token", params.presignedPostFields?.xAmzSecurityToken);
    data.append("Policy", params.presignedPostFields?.policy);
    data.append("X-Amz-Signature", params.presignedPostFields?.xAmzSignature);
    data.append("file", params.file, params.file.name);
    
    return {
      url: params.urlUpload,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      useRetry: true,
      provider: {
        url: params.urlUpload,
        name: 's3',
      },
      data,
      onUploadProgress,
    };
  },
  getImageStatus: (id: string): HttpApiRequestConfig => {
    return {
      ...defaultConfig,
      url: `${provider.url}images/${id}?wait=true`,
      method: 'get',
      timeout: appConfig.getStatusImageTimeout,
    };
  },
};

const uploadApi = {
  createFileId: (uploadType: ResourceUploadType) => makeHttpRequest(uploadApiConfig.createFileId(uploadType)),
  createImageId: (params?: ICreateImageIdData) => makeHttpRequest(uploadApiConfig.createImageId(params)),
  uploadImageToS3: (
    params: IUploadImageS3Params,
    onUploadProgress: (progressEvent: any) => void,
  ) => makeHttpRequest(uploadApiConfig.uploadImagetToS3(params, onUploadProgress)),
  getImageStatus: (id: string) => makeHttpRequest(uploadApiConfig.getImageStatus(id)),
};

export default uploadApi;
