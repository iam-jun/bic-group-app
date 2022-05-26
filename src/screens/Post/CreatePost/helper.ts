import {IFilePicked} from '~/interfaces/common';
import {IActivityDataImage} from '~/interfaces/IPost';
import FileUploader from '~/services/fileUploader';
import VideoUploader from '~/services/videoUploader';

export const validateImages = (
  selectingImages: IFilePicked[] | IActivityDataImage[],
  t: any,
) => {
  let imageError = '';
  let imageUploading = false;
  const images: IActivityDataImage[] = [];
  // @ts-ignore
  selectingImages?.map?.((item: any) => {
    if (item?.url) {
      images.push({
        id: item?.id,
        name: item?.url || '',
        origin_name: item?.fileName,
        width: item?.file?.width,
        height: item?.file?.height,
      });
    } else {
      const {file, fileName} = item || {};
      const {url, uploading, result} =
        FileUploader.getInstance().getFile(fileName) || {};
      if (uploading) {
        imageUploading = true;
        imageError = t('post:error_wait_uploading');
      } else if (!url) {
        imageError = t('post:error_upload_failed');
      }
      images.push({
        id: result?.id,
        name: url || '',
        origin_name: fileName,
        width: file?.width,
        height: file?.height,
      });
    }
  });
  return {imageError, images, imageUploading};
};

export const validateVideo = (
  selectingVideo: IFilePicked | IActivityDataImage | any,
  t: any,
) => {
  let videoError = '';
  let video;
  let videoUploading = false;
  if (!selectingVideo) {
    return {video, videoError};
  }
  if (selectingVideo?.id) {
    video = selectingVideo;
  } else {
    const filename =
      selectingVideo?.fileName ||
      selectingVideo?.filename ||
      selectingVideo?.name;
    const {uploading, result} = VideoUploader.getInstance().getFile(filename);
    if (uploading) {
      videoUploading = true;
      videoError = t('post:error_wait_uploading');
    } else if (!result?.id) {
      videoError = t('post:error_upload_failed');
    } else {
      video = result;
    }
  }
  return {video, videoError, videoUploading};
};
