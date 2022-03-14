import {IFilePicked} from '~/interfaces/common';
import {IActivityDataImage} from '~/interfaces/IPost';
import FileUploader from '~/services/fileUploader';

export const validateImages = (
  selectingImages: IFilePicked[] | IActivityDataImage[],
  t: any,
) => {
  let imageError = '';
  const images: IActivityDataImage[] = [];
  // @ts-ignore
  selectingImages?.map?.((item: any) => {
    if (item?.url) {
      images.push({
        name: item?.url || '',
        origin_name: item?.fileName,
        width: item?.file?.width,
        height: item?.file?.height,
      });
    } else {
      const {file, fileName} = item || {};
      const {url, uploading} =
        FileUploader.getInstance().getFile(fileName) || {};
      if (uploading) {
        imageError = t('post:error_wait_uploading');
      } else if (!url) {
        imageError = t('error_upload_failed');
      }
      images.push({
        name: url || '',
        origin_name: fileName,
        width: file?.width,
        height: file?.height,
      });
    }
  });
  return {imageError, images};
};
