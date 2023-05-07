import i18next from 'i18next';
import { makeHttpRequest } from '~/api/apiRequest';
import uploadApi, { uploadApiConfig } from '~/api/UploadApi';
import { getErrorMessageFromResponse } from '~/utils/link';
import { IGetFile, IUploaderState, IUploadParam } from '..';

const uploadFile = (set, _get) => async (data: IUploadParam) => {
  const { uploadType, file } = data;

  const controller = new AbortController();

  set((state: IUploaderState) => {
    state.uploadingFiles[file.name] = 0;
    state.abortController[file.name] = controller;
  }, 'action uploadFile');

  const onUploadProgress = (progressEvent: any) => {
    const percentCompleted = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total,
    );
    set((state: IUploaderState) => {
      state.uploadingFiles[file.name] = percentCompleted;
    }, 'action uploadFile progress');
    // eslint-disable-next-line no-console
    console.log(
      `\x1b[36m🐣️ fileUploader _onUploadProgress: ${percentCompleted}\x1b[0m`,
    );
  };

  try {
    const createIdResponse = await uploadApi.createFileId(uploadType);
    const fileId = createIdResponse?.data?.data?.id;

    const uploadResponse = await makeHttpRequest(
      uploadApiConfig.uploadFile(
        fileId,
        uploadType,
        file,
        controller.signal,
        onUploadProgress,
      ),
    );

    const data = uploadResponse?.data?.data;

    // cancel request
    if (!data && uploadResponse.status !== 600) {
      throw new Error(getErrorMessageFromResponse(uploadResponse));
    }

    const result: IGetFile = {
      id: data?.id,
      name: data?.properties?.name,
      size: data?.properties?.size,
      url: data?.originUrl,
      type: data?.properties?.mimeType,
    };

    if (uploadType.includes('video')) {
      result.thumbnails = data?.thumbnails;
    }

    set((state: IUploaderState) => {
      state.uploadedFiles[file.name] = result;
      state.uploadingFiles?.[file.name] && delete state.uploadingFiles?.[file.name];
    }, 'action uploadFile success');
  } catch (error) {
    const fileType = i18next.t('file_type:file');
    const errorUploadMessage = i18next.t('upload:text_upload_request_failed', {
      file_type: fileType,
    });
    const message = getErrorMessageFromResponse(error) || errorUploadMessage;
    set((state: IUploaderState) => {
      state.errors[file.name] = message;
    }, 'action uploadFile error');
  }
};

export default uploadFile;
