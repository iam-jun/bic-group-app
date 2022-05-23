import ApiConfig from '~/configs/apiConfig';
import {IFilePicked} from '~/interfaces/common';
import {makeHttpRequest} from '~/services/httpApiRequest';
import {AppConfig} from '~/configs';
import i18next from 'i18next';
import {IUploadType} from '~/configs/resourceConfig';
import {CancelTokenSource} from 'axios';

export interface IGetFile {
  id?: number | string;
  fileName: string;
  url?: string;
  size?: any;
  uploading?: boolean;
  uploadType?: IUploadType;
  result?: any;
}

export interface IUploadParam {
  uploadType: IUploadType | string;
  file: IFilePicked;
  onSuccess?: (data: IGetFile) => void;
  onProgress?: (percent: number) => void;
  onError?: (e: any) => void;
}

export interface ICancelUploadParam {
  uploadType: IUploadType | string;
  file: IFilePicked;
}

export default class FileUploader {
  static INSTANCE: FileUploader | null = null;

  fileUploaded: {[x: string]: IGetFile} = {};
  fileUploading: any = {};
  fileCancelTokenSource: {[x: string]: CancelTokenSource} = {};

  callbackProgress: any = {};
  callbackSuccess: any = {};
  callbackError: any = {};

  static getInstance() {
    if (!FileUploader.INSTANCE) {
      FileUploader.INSTANCE = new FileUploader();
    }
    return FileUploader.INSTANCE;
  }

  getFile(
    fileName: string,
    onSuccess?: (data: IGetFile) => void,
    onProgress?: (percent: number) => void,
    onError?: (e: any) => void,
  ): IGetFile {
    if (onSuccess) {
      this.callbackSuccess[fileName] = onSuccess;
    }
    if (onProgress) {
      this.callbackProgress[fileName] = onProgress;
    }
    if (onError) {
      this.callbackError[fileName] = onProgress;
    }
    return {
      fileName: fileName,
      uploading: this.fileUploading[fileName],
      url: this.fileUploaded[fileName]?.url,
      result: this.fileUploaded[fileName]?.result,
    };
  }

  async upload(params: IUploadParam) {
    const {file, uploadType, onSuccess, onProgress, onError} = params || {};
    if (!file) {
      console.log(`\x1b[31m🐣️ fileUploader upload: file not found!\x1b[0m`);
      onError?.('Input file not found');
      return Promise.reject({meta: {message: 'Input file not found'}});
    }
    if (this.fileUploaded[file.name]) {
      const uploaded = this.fileUploaded[file.name];
      if (
        uploaded.url &&
        uploaded?.uploadType === uploadType &&
        uploaded?.size === file?.size
      ) {
        onSuccess?.(uploaded);
        return Promise.resolve(uploaded);
      }
    }
    if (file.size > AppConfig.maxFileSize) {
      const error = i18next.t('common:error:file:over_file_size');
      console.log(`\x1b[31m🐣️ fileUploader upload error: ${error}\x1b[0m`);
      onError?.(error);
      return Promise.reject({meta: {message: error}});
    }

    const formData = new FormData();
    // @ts-ignore
    formData.append('file', file, file.name);
    formData.append(
      'description',
      JSON.stringify({
        size: file.size,
        type: file.type,
      }),
    );

    const _onUploadProgress = (progressEvent: any) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total,
      );
      onProgress?.(percentCompleted);
      this.callbackProgress?.[file.name]?.(percentCompleted);
    };

    this.fileUploading[file.name] = true;
    try {
      const response: any = await makeHttpRequest(
        ApiConfig.Upload.uploadFile(uploadType, formData, _onUploadProgress),
      );
      const uploadedUrl =
        response?.data?.data?.url || response?.data?.data?.src;
      console.log(
        `\x1b[32m🐣️ fileUploader response url: ${uploadedUrl} \x1b[0m`,
      );
      this.fileUploading[file.name] = false;
      if (uploadedUrl) {
        const fileRes = response?.data?.data;
        this.fileUploaded[file.name] = {
          url: uploadedUrl,
          uploadType,
          uploading: false,
          fileName: file.name,
          size: file?.size,
          result: fileRes,
        };
        onSuccess?.(this.fileUploaded[file.name]);
        this.callbackSuccess?.[file.name]?.(this.fileUploaded[file.name]);
        return Promise.resolve(this.fileUploaded[file.name]);
      } else {
        onError?.(response?.data);
        this.callbackError?.[file.name]?.(response?.data);
        console.log(`\x1b[31m🐣️ fileUploader upload err`, response, `\x1b[0m`);
        return Promise.reject(response?.data);
      }
    } catch (e) {
      this.fileUploading[file.name] = false;
      console.log(`\x1b[31m🐣️ fileUploader error `, e, `\x1b[0m`);
      onError?.(e);
      this.callbackError?.[file.name]?.(e);
      return Promise.reject(e);
    }
  }

  delete() {
    console.log(`\x1b[36m🐣️ fileUploader delete\x1b[0m`);
  }
}
