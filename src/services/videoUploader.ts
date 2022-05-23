import ApiConfig from '~/configs/apiConfig';
import {makeHttpRequest} from '~/services/httpApiRequest';
import {AppConfig} from '~/configs';
import i18next from 'i18next';
import FileUploader, {
  ICancelUploadParam,
  IGetFile,
  IUploadParam,
} from '~/services/fileUploader';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import {IPostCreateMediaVideo} from '~/interfaces/IPost';
import {isEmpty} from 'lodash';
import axios from 'axios';

export default class VideoUploader extends FileUploader {
  static INSTANCE: VideoUploader | null = null;

  static getInstance() {
    if (!VideoUploader.INSTANCE) {
      VideoUploader.INSTANCE = new VideoUploader();
    }
    return VideoUploader.INSTANCE;
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

  async requestCreateVideoId() {
    try {
      const response: any = await makeHttpRequest(
        ApiConfig.Upload.createVideoId(),
      );
      const {id} = response?.data?.data || {};
      if (id) {
        return {id, error: ''};
      } else {
        return {
          error:
            this.getResponseErrMsg(response) ||
            'upload:text_create_video_id_response_failed',
        };
      }
    } catch (e) {
      return {error: 'upload:text_create_video_id_request_failed'};
    }
  }

  async requestUploadFile(
    file: any,
    videoId: string,
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
        `\x1b[36m🐣️ videoUploader _onUploadProgress: ${percentCompleted}\x1b[0m`,
      );
    };

    try {
      const cancelTokenSource = axios.CancelToken.source();
      this.fileCancelTokenSource[file.name] = cancelTokenSource;
      const response: any = await makeHttpRequest(
        ApiConfig.Upload.uploadVideo(
          videoId,
          uploadType,
          formData,
          _onUploadProgress,
          cancelTokenSource.token,
        ),
      );
      if (response?.data?.data) {
        return {video: response.data.data, error: ''};
      } else {
        return {
          error:
            this.getResponseErrMsg(response) ||
            'upload:text_upload_video_response_failed',
        };
      }
    } catch (e) {
      return {
        error:
          this.getResponseErrMsg(e) ||
          'upload:text_upload_video_request_failed',
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
    let videoId, videoUploaded, mediaCreated;
    this.fileUploading[file.name] = true;

    //create video id
    try {
      const createIdResponse = await this.requestCreateVideoId();
      if (createIdResponse?.id) {
        videoId = createIdResponse.id;
      } else {
        this.handleError(file, createIdResponse?.error, onError);
        return Promise.reject({meta: {message: createIdResponse?.error || ''}});
      }
    } catch (e: any) {
      this.handleError(file, e?.error, onError);
      return Promise.reject({meta: {message: e?.error || ''}});
    }

    //upload video with created id
    try {
      const uploadResponse = await this.requestUploadFile(
        file,
        videoId,
        uploadType,
        onSuccess,
        onProgress,
      );
      if (uploadResponse?.video) {
        videoUploaded = uploadResponse.video;
      } else {
        this.handleError(file, uploadResponse?.error, onError);
        return Promise.reject({meta: {message: uploadResponse?.error || ''}});
      }
    } catch (e: any) {
      this.handleError(file, e?.error, onError);
      return Promise.reject({meta: {message: e?.error || ''}});
    }

    //create media with video uploaded
    try {
      const videoProps = videoUploaded?.properties || {};
      const payload: IPostCreateMediaVideo = {
        uploadId: videoUploaded?.id,
        uploadType: uploadType,
        ...videoProps,
      };
      const mediaResponse = await postDataHelper.postCreateMediaVideo(payload);
      if (mediaResponse?.data?.data) {
        mediaCreated = mediaResponse.data.data;
      } else {
        this.handleError(
          file,
          this.getResponseErrMsg(mediaResponse) ||
            'upload:text_create_media_response_failed',
          onError,
        );
      }
    } catch (e: any) {
      const msg =
        this.getResponseErrMsg(e) || 'upload:text_create_media_request_failed';
      this.handleError(file, msg, onError);
      return Promise.reject({meta: {message: msg}});
    }

    this.fileUploading[file.name] = false;

    //upload file success
    this.fileUploaded[file.name] = {
      id: mediaCreated?.id,
      url: mediaCreated?.url,
      uploadType,
      uploading: false,
      fileName: file.name,
      size: file?.size,
      result: mediaCreated,
    };
    onSuccess?.(this.fileUploaded[file.name]);
    this.callbackSuccess?.[file.name]?.(this.fileUploaded[file.name]);
    return Promise.resolve(this.fileUploaded[file.name]);
  }

  async upload(params: IUploadParam) {
    const {file, uploadType, onSuccess, onProgress, onError} = params || {};
    if (!file || isEmpty(file)) {
      console.log(`\x1b[31m🐣️ VideoUploader upload: file not found!\x1b[0m`);
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
    if (file.size > AppConfig.maxVideoSize) {
      const error = i18next.t('common:error:file:over_file_size');
      console.log(`\x1b[31m🐣️ VideoUploader upload error: ${error}\x1b[0m`);
      onError?.(error);
      return Promise.reject({meta: {message: error}});
    }
    return this.startUpload(file, uploadType, onSuccess, onProgress, onError);
  }

  cancel(params: ICancelUploadParam) {
    console.log(`\x1b[36m🐣️ videoUploader cancel\x1b[0m`);
    const {file} = params || {};
    const filename = file?.name || file?.filename || file?.fileName;
    this.fileCancelTokenSource?.[filename]?.cancel?.();
  }
}
