import i18next from 'i18next';
import { makeHttpRequest } from '~/api/apiRequest';
import uploadApi, { uploadApiConfig } from '~/api/UploadApi';
import { getErrorMessageFromResponse } from '~/utils/link';
import { IGetFile, IUploaderState, IUploadParam } from '..';

const upload = (set, _get) => async (data: IUploadParam) => {
  const { type, uploadType, file } = data;

  const controller = new AbortController();

  set((state: IUploaderState) => {
    state.uploadingFiles[file.name] = 0;
    state.abortController[file.name] = controller;
  }, 'upload');

  const onUploadProgress = (progressEvent: any) => {
    const percentCompleted = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total,
    );
    set((state: IUploaderState) => {
      state.uploadingFiles[file.name] = percentCompleted;
    }, 'upload progress');
    // eslint-disable-next-line no-console
    console.log(
      `\x1b[36m🐣️ fileUploader _onUploadProgress: ${percentCompleted}\x1b[0m`,
    );
  };

  try {
    let fileId = '';

    const createIdResponse = await uploadApi.createFileId(uploadType);
    fileId = createIdResponse?.data?.data?.id;

    let uploadResponse = null;

    if (type === 'image') {
      uploadResponse = await uploadApi.uploadImage(
        uploadType,
        file,
        onUploadProgress,
      );
    } else {
      uploadResponse = await makeHttpRequest(
        uploadApiConfig.uploadFile(
          fileId,
          uploadType,
          file,
          controller.signal,
          onUploadProgress,
        ),
      );
    }

    const data = uploadResponse?.data?.data;

    // cancel request
    if (!data && uploadResponse.status !== 600) {
      throw new Error(getErrorMessageFromResponse(uploadResponse));
    }
    let result: IGetFile = null;
    if (type === 'image') {
      const uploadedUrl
        = uploadResponse?.data?.data?.url || uploadResponse?.data?.data?.src;
      if (uploadedUrl) {
        const fileRes = uploadResponse?.data?.data;
        result = {
          url: uploadedUrl,
          uploadType,
          uploading: false,
          name: file.name,
          size: file?.size,
          result: fileRes,
        };
      }
    } else {
      result = {
        id: data?.id,
        name: data?.properties?.name,
        size: data?.properties?.size,
        url: data?.originUrl,
        type: data?.properties?.mimeType,
      };
    }

    if (uploadType.includes('video')) {
      result.thumbnails = data?.thumbnails;
    }

    set((state: IUploaderState) => {
      state.uploadedFiles[file.name] = result;
      state.uploadingFiles?.[file.name]
        && delete state.uploadingFiles?.[file.name];
    }, 'upload success');
  } catch (error) {
    const fileType = i18next.t('file_type:file');
    const errorUploadMessage = i18next.t('upload:text_upload_request_failed', {
      file_type: fileType,
    });
    const message = getErrorMessageFromResponse(error) || errorUploadMessage;
    set((state: IUploaderState) => {
      state.errors[file.name] = message;
    }, 'upload error');
  }
};

export default upload;
