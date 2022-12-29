import i18next from 'i18next';
import useModalStore from '~/store/modal';
import ImageUploader, { IGetFile, IUploadParam } from '~/services/imageUploader';

export const uploadImage = async ({ file, onSuccess }: {
  file: any, onSuccess: (file: IGetFile) => void
}) => {
  const onError = (error) => {
    const content = typeof error === 'string' ? error : i18next.t('post:error_upload_photo_failed');
    useModalStore.getState().actions.showToast({ content });
  };

  const uploadType = 'post_image';
  const param: IUploadParam = {
    uploadType,
    file,
    onSuccess,
    onError,

  };
  try {
    await ImageUploader.getInstance().upload(param);
  } catch (error) {
    onError(error);
  }
};
