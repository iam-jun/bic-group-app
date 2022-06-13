import ApiConfig from '~/configs/apiConfig';
import {IFilePicked} from '~/interfaces/common';
import {makeHttpRequest} from '~/services/httpApiRequest';
import {AppConfig} from '~/configs';
import i18next from 'i18next';
import {IUploadType} from '~/configs/resourceConfig';
import {isEmpty} from 'lodash';

export interface IGetFile {
  id?: number | string;
  fileName: string;
  url?: string;
  size?: any;
  uploading?: boolean;
  uploadType?: IUploadType;
  result?: any;
}

export interface IFileUploadResponse {
  id?: number | string;
  originUrl: string;
  properties: {
    name: string;
    mimeType: string;
    size: number;
  };
}

export interface IUploadParam {
  uploadType: IUploadType;
  file: IFilePicked;
  onSuccess?: (data: IGetFile) => void;
  onProgress?: (percent: number) => void;
  onError?: (e: any) => void;
}

export interface ICancelUploadParam {
  uploadType?: IUploadType;
  file: IFilePicked;
}

export default class FileUploader {
  static INSTANCE: FileUploader | null = null;

  fileUploaded: {[x: string]: IGetFile} = {};
  fileUploading: any = {};
  fileAbortController: {[x: string]: AbortController} = {};

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

  getResponseErrMsg(response: any) {
    const meta = response?.data?.meta || {};
    return meta?.errors?.[0]?.message || meta?.message;
  }

  handleError(file: any, data: any, onError: any) {
    this.fileUploading[file.name] = false;
    onError?.(data);
    this.callbackError?.[file?.name]?.(data);
  }

  async requestCreateFileId(uploadType: string) {
    try {
      const response: any = await makeHttpRequest(
        ApiConfig.Upload.createFileId(uploadType),
      );
      const {id} = response?.data?.data || {};
      if (id) {
        return {id, error: ''};
      } else {
        return {
          error:
            this.getResponseErrMsg(response) ||
            'upload:text_create_file_id_response_failed',
        };
      }
    } catch (e) {
      return {error: 'upload:text_create_file_id_request_failed'};
    }
  }

  async requestUploadFile(
    file: any,
    fileId: string,
    uploadType: any,
    onSuccess?: (data: IGetFile) => void,
    onProgress?: (percent: number) => void,
  ) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('uploadType', uploadType);

    const _onUploadProgress = (progressEvent: any) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total,
      );
      onProgress?.(percentCompleted);
      this.callbackProgress?.[file.name]?.(percentCompleted);
      console.log(
        `\x1b[36m🐣️ fileUploader _onUploadProgress: ${percentCompleted}\x1b[0m`,
      );
    };

    try {
      const controller = new AbortController();
      this.fileAbortController[file.name] = controller;
      const response: any = await makeHttpRequest(
        ApiConfig.Upload.uploadFile(
          fileId,
          uploadType,
          formData,
          _onUploadProgress,
          controller.signal,
        ),
      );
      if (response?.data?.data) {
        const result = {
          id: response?.data?.data?.id,
          fileName: response?.data?.data?.properties?.name,
          size: response?.data?.data?.properties?.size,
          url: response?.data?.data.originUrl,
          type: response?.data?.data?.properties?.mimeType,
        };
        return {files: result, error: ''};
      } else {
        return {
          error:
            this.getResponseErrMsg(response) ||
            i18next.t('upload:text_upload_response_failed', {
              file_type: i18next.t('file_type:file'),
            }),
        };
      }
    } catch (e) {
      return {
        error:
          this.getResponseErrMsg(e) ||
          i18next.t('upload:text_upload_request_failed', {
            file_type: i18next.t('file_type:file'),
          }),
      };
    }
  }

  async startUpload(
    file: any,
    uploadType: any,
    onSuccess?: (data: IGetFile) => void,
    onProgress?: (percent: number) => void,
    onError?: (e: any) => void,
  ) {
    let fileId, fileUploaded;
    this.fileUploading[file.name] = true;

    //create file id
    try {
      const createIdResponse = await this.requestCreateFileId(uploadType);
      if (createIdResponse?.id) {
        fileId = createIdResponse.id;
      } else {
        this.handleError(file, createIdResponse?.error, onError);
        return Promise.reject({meta: {message: createIdResponse?.error || ''}});
      }
    } catch (e: any) {
      this.handleError(file, e?.error, onError);
      return Promise.reject({meta: {message: e?.error || ''}});
    }

    //upload file with created id
    try {
      const uploadResponse = await this.requestUploadFile(
        file,
        fileId,
        uploadType,
        onSuccess,
        onProgress,
      );
      if (uploadResponse?.files) {
        fileUploaded = uploadResponse.files;
      } else {
        this.handleError(file, uploadResponse?.error, onError);
        return Promise.reject({meta: {message: uploadResponse?.error || ''}});
      }
    } catch (e: any) {
      this.handleError(file, e?.error, onError);
      return Promise.reject({meta: {message: e?.error || ''}});
    }

    this.fileUploading[file.name] = false;

    //upload file success
    this.fileUploaded[file.name] = {
      id: fileUploaded?.id,
      url: fileUploaded?.url,
      uploadType,
      uploading: false,
      fileName: file.name,
      size: file?.size,
      result: fileUploaded,
    };
    onSuccess?.(this.fileUploaded[file.name]);
    this.callbackSuccess?.[file.name]?.(this.fileUploaded[file.name]);
    return Promise.resolve(this.fileUploaded[file.name]);
  }

  async upload(params: IUploadParam) {
    const {file, uploadType, onSuccess, onProgress, onError} = params || {};
    if (!file || isEmpty(file)) {
      console.log(`\x1b[31m🐣️ FileUploader upload: file not found!\x1b[0m`);
      onError?.('Input file not found');
      return Promise.reject({meta: {message: 'Input file not found'}});
    }
    if (this.fileUploaded[file.name]) {
      const uploaded = this.fileUploaded[file.name];
      if (
        (uploaded?.id || uploaded?.url) &&
        uploaded?.uploadType === uploadType &&
        uploaded?.size === file?.size
      ) {
        onSuccess?.(uploaded);
        return Promise.resolve(uploaded);
      }
    }
    const type = uploadType.split('_')[1] || 'file';

    //@ts-ignore
    const maxSize = AppConfig.maxFileSize[type];

    if (file.size > maxSize) {
      const error = i18next.t(`upload:text_${type}_over_size`);
      console.log(`\x1b[31m🐣️ FileUploader upload error: ${error}\x1b[0m`);
      onError?.(error);
      return Promise.reject({meta: {message: error}});
    }
    return this.startUpload(file, uploadType, onSuccess, onProgress, onError);
  }

  delete() {
    console.log(`\x1b[36m🐣️ fileUploader delete\x1b[0m`);
  }

  cancel(params: ICancelUploadParam) {
    console.log(`\x1b[36m🐣️ videoUploader cancel\x1b[0m`);
    const {file} = params || {};
    const filename = file?.name || file?.filename || file?.fileName;
    this.fileAbortController?.[filename]?.abort?.();
  }
}
