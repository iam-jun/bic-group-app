import { ToastType } from '~/baseComponents/Toast/BaseToast';
import appConfig from '~/configs/appConfig';
import { useBaseHook } from '~/hooks';
import { IFilePicked } from '~/interfaces/common';
import { ICreatePostImage } from '~/interfaces/IPost';
import showToast from '~/store/helper/showToast';
import useCreatePostStore from '../store';

export const useUploadImage = () => {
  const { t } = useBaseHook();
  const selectedImages = useCreatePostStore((state) => state.createPost.images || []);
  const createPostStoreActions = useCreatePostStore((state) => state.actions);

  const sliceLstImagesToMaximumImagesAllowed = (lstImages: ICreatePostImage[]) => lstImages.slice(
    0,
    appConfig.postPhotoLimit,
  );

  const isOverMaximumImagesAllowed = (images: any[]) => images.length > appConfig.postPhotoLimit;

  const showErrorOverMaximumImagesAllowed = () => {
    const errorContent = t('post:error_reach_upload_photo_limit').replace(
      '%LIMIT%', appConfig.postPhotoLimit,
    );
    showToast({
      content: errorContent,
      type: ToastType.ERROR,
    });
  };

  const handleImage = (images: IFilePicked[]) => {
    const newImages: ICreatePostImage[] = [];
    images.forEach((item) => {
      newImages.push({ fileName: item.filename, file: item });
    });
    let newCurrentImages = [...selectedImages, ...newImages];

    if (isOverMaximumImagesAllowed(newCurrentImages)) {
      showErrorOverMaximumImagesAllowed();
      newCurrentImages = sliceLstImagesToMaximumImagesAllowed(newCurrentImages);
    }

    createPostStoreActions.updateCreatePost({ images: newCurrentImages });
  };

  return {
    handleImage,
  };
};

export default useUploadImage;
