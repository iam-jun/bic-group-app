import ApiConfig from '~/configs/apiConfig';
import {IFilePicked} from '~/interfaces/common';
import {makeHttpRequest} from '~/services/httpApiRequest';

export const uploadTypes = {
  userAvatar: 'userAvatar',
  userCover: 'userCover',
  groupAvatar: 'groupAvatar',
  groupCover: 'groupCover',
  postImage: 'postImage',
  postVideo: 'postVideo',
  postFile: 'postFile',
  chatImage: 'chatImage',
  chatVideo: 'chatVideo',
  chatFile: 'chatFile',
};

export type IUploadType = keyof typeof uploadTypes;

export interface IGetFile {
  fileName: string;
  url?: string;
  uploading?: boolean;
}

export default class FileUploader {
  static INSTANCE: FileUploader | null = null;

  fileUploaded: any = {};
  fileUploading: any = {};

  callbackProgress: any = {};
  callbackSuccess: any = {};

  static getInstance() {
    if (!FileUploader.INSTANCE) {
      FileUploader.INSTANCE = new FileUploader();
    }
    return FileUploader.INSTANCE;
  }

  getFile(
    fileName: string,
    onSuccess: (url: string) => void,
    onProgress: (percent: number) => void,
  ) {
    if (!fileName) {
      return;
    }
    if (onSuccess) {
      this.callbackSuccess[fileName] = onSuccess;
    }
    if (onProgress) {
      this.callbackProgress[fileName] = onProgress;
    }
    const result: IGetFile = {
      fileName: fileName,
      uploading: this.fileUploading[fileName],
      url: this.fileUploaded[fileName],
    };
    return result;
  }

  upload(
    uploadType: IUploadType | string,
    file: IFilePicked,
    onSuccess: (url: string) => void,
    onProgress: (percent: number) => void,
    onError: (e: any) => void,
  ) {
    if (!file) {
      console.log(`\x1b[31m🐣️ fileUploader upload: file not found!\x1b[0m`);
      onError?.('input file not found');
      return;
    }
    if (this.fileUploaded[file.name]) {
      onSuccess?.(this.fileUploaded[file.name]);
      return;
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
    makeHttpRequest(
      ApiConfig.Upload.uploadFile(uploadType, formData, _onUploadProgress),
    )
      .then((response: any) => {
        console.log(
          `\x1b[32m🐣️ fileUploader response url: ${response?.data?.data?.src} \x1b[0m`,
        );
        this.fileUploading[file.name] = false;
        if (response?.data?.data?.src) {
          const url = response?.data?.data?.src;
          this.fileUploaded[file.name] = url;
          onSuccess?.(url);
          this.callbackSuccess?.[file.name]?.(url);
        } else {
          onError(response?.data);
        }
      })
      .catch(e => {
        this.fileUploading[file.name] = false;
        console.log(`\x1b[31m🐣️ fileUploader error `, e, `\x1b[0m`);
        onError(e);
      });
  }

  delete() {
    console.log(`\x1b[36m🐣️ fileUploader delete\x1b[0m`);
  }
}
