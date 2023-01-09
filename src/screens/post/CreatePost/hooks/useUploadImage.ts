import { useDispatch } from 'react-redux';
import { ToastType } from '~/baseComponents/Toast/BaseToast';
import appConfig from '~/configs/appConfig';
import { useBaseHook } from '~/hooks';
import { useKeySelector } from '~/hooks/selector';
import { IFilePicked } from '~/interfaces/common';
import { ICreatePostImage } from '~/interfaces/IPost';
import showToast from '~/store/helper/showToast';
import postActions from '~/storeRedux/post/actions';
import postKeySelector from '~/storeRedux/post/keySelector';

export const useUploadImage = () => {
  const dispatch = useDispatch();
  const { t } = useBaseHook();
  const selectedImagesDraft: ICreatePostImage[] = useKeySelector(postKeySelector.createPost.imagesDraft) || [];

  const checkCurrentImages = (currentImage: ICreatePostImage[]) => {
    const errorContent = t('post:error_reach_upload_photo_limit').replace(
      '%LIMIT%', appConfig.postPhotoLimit,
    );
    showToast({
      content: errorContent,
      type: ToastType.ERROR,
    });
    return currentImage.slice(
      0,
      appConfig.postPhotoLimit,
    );
  };

  const handleImage = (images: IFilePicked[]) => {
    const newImages: ICreatePostImage[] = [];
    images.forEach((item) => {
      newImages.push({ fileName: item.filename, file: item });
    });
    let newCurrentImages = [...selectedImagesDraft, ...newImages];
    if (newCurrentImages.length > appConfig.postPhotoLimit) {
      newCurrentImages = checkCurrentImages(newCurrentImages);
    }
    dispatch(postActions.setCreatePostImagesDraft(newCurrentImages));
    dispatch(postActions.setCreatePostImages(newCurrentImages));
  };

  return {
    handleImage,
  };
};

export default useUploadImage;
