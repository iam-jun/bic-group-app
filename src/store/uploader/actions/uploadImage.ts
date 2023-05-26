import i18next from 'i18next';
import uploadApi from '~/api/UploadApi';
import { getErrorMessageFromResponse } from '~/utils/link';
import { IGetFile, IUploaderState, IUploadParam } from '..';
import { ICreateImageIdData, IUploadImageS3Params } from '~/interfaces/IUpload';

const uploadImage = (set, _get) => async (data: IUploadParam) => {
  const { uploadType, file } = data;
  const controller = new AbortController();

  set((state: IUploaderState) => {
    state.uploadingFiles[file.name] = 0;
    state.abortController[file.name] = controller;
    state.errors[file.name] = '';
  }, 'action uploadImage');

  const onUploadProgress = (progressEvent: any) => {
    const percentCompleted = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total,
    );
    set((state: IUploaderState) => {
      state.uploadingFiles[file.name] = percentCompleted;
    }, 'action uploadImage progress');
    // eslint-disable-next-line no-console
    console.log(`\x1b[36m🐣️ imageUploader _onUploadProgress: ${percentCompleted}\x1b[0m`);
  };

  try {
    const paramsCreateId: ICreateImageIdData = {
      properties: {
        mime_type: file.mime,
      },
      resource: uploadType,
    };

    // step 1: create image id
    const createIdResponse = await uploadApi.createImageId(paramsCreateId);

    if (createIdResponse?.data?.data?.presignedPost?.url) {
      // step 2: upload image to s3
      const responseUploadImg: any = await uploadApi.uploadImageToS3(
        {
          presignedPostFields: {
            ...createIdResponse?.data?.data?.presignedPost?.fields,
          },
          urlUpload: createIdResponse?.data?.data?.presignedPost?.url,
          file,
        } as IUploadImageS3Params,
        onUploadProgress,
      );

      /* eslint no-else-return: ["error", {allowElseIf: true}] */
      if (responseUploadImg.status === 204) {
        // step 3: get image status
        const responseGetStatus = await uploadApi.getImageStatus(createIdResponse?.data?.data?.id);

        // cancel request
        if (!responseGetStatus?.data?.data && responseGetStatus.status !== 600) {
          throw new Error(getErrorMessageFromResponse(responseGetStatus));
        }

        if (responseGetStatus?.data?.data?.status === 'DONE' && responseGetStatus?.data?.data?.url) {
          const result: IGetFile = {
            id: responseGetStatus?.data?.data?.id,
            url: responseGetStatus?.data?.data?.url,
            uploadType,
            uploading: false,
            name: file.name,
            size: file?.size,
            result: responseGetStatus?.data?.data,
          };

          set((state: IUploaderState) => {
            state.uploadedFiles[file.name] = result;
            state.uploadingFiles?.[file.name] && delete state.uploadingFiles?.[file.name];
          }, 'action uploadImage success');
        } else {
          // upload image failed
          throw new Error(responseGetStatus?.data?.data?.errorMessage);
        }
      } else if (responseUploadImg.code === 0) {
        throw new Error(responseUploadImg.meta.message);
      }
    }
  } catch (error) {
    const errorUploadMessage = i18next.t('upload:text_upload_image_fail');
    const message = getErrorMessageFromResponse(error) || errorUploadMessage;
    set((state: IUploaderState) => {
      state.errors[file.name] = message;
      state.uploadingFiles?.[file.name] && delete state.uploadingFiles?.[file.name];
    }, 'action uploadImage error');
    throw error;
  }
};

export default uploadImage;
