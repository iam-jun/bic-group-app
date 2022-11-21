import i18next from 'i18next';
import ImageUploader, { IGetFile, IUploadParam } from '~/services/imageUploader';
import modalActions from '~/storeRedux/modal/actions';

export const uploadImage = async ({ file, dispatch, onSuccess }: {
  file: any, dispatch:any, onSuccess: (file: IGetFile) => void
}) => {
  const onError = (error) => {
    const content = typeof error === 'string' ? error : i18next.t('post:error_upload_photo_failed');
    dispatch(modalActions.showHideToastMessage({ content }));
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
