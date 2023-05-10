import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';
import { t } from 'i18next';
import { Platform } from 'react-native';
import { IFilePicked } from '~/interfaces/common';
import { formatBytes } from '~/utils/formatter';
import { ToastType } from '~/baseComponents/Toast/BaseToast';
import showToast from '~/store/helper/showToast';

const formatImage = (image: any) => {
  const fileName = image?.path?.replace?.(
    /(.+)\/(.+)$/, '$2',
  ) || 'bein_image';
  return {
    name: fileName,
    filename: fileName,
    type: image?.mime,
    mime: image?.mime,
    size: image?.size,
    uri: image?.path,
    width: image?.width,
    height: image?.height,
  };
};

const openPickerSingle = async (option = {}) => {
  try {
    const image = await ImagePicker.openPicker({
      cropping: false,
      mediaType: 'any',
      multiple: false,
      compressVideoPreset: 'Passthrough',
      forceJpg: true,
      ...option,
    });
    if (image) {
      const result: IFilePicked = formatImage(image);
      return Promise.resolve(result);
    }
    return Promise.reject(new Error('Image not found'));
  } catch (e) {
    return Promise.reject(e);
  }
};

const openPickerSinglePhotoWithCropping = async (
  option:
    {
      width?: number,
      height?: number,
      maxSize: number,
      exclusionList: string[]
    },
) => {
  try {
    const image = await ImagePicker.openPicker({
      mediaType: 'photo',
    });
    if (image) {
      const {
        width, height, maxSize, exclusionList,
      } = option;

      // Get original file size
      let dataFromOriginalFile = null;
      if (Platform.OS === 'ios') {
        const { sourceURL } = image;
        const filePath = sourceURL.replace('file://', '');
        dataFromOriginalFile = await RNFetchBlob.fs.stat(filePath);
      } else {
        dataFromOriginalFile = image;
      }

      let errorText = null;
      if (dataFromOriginalFile?.size > maxSize) {
        errorText = t('common:error:file:file_exceed_limit').replace('{n}', formatBytes(maxSize, 0));
      }
      if (exclusionList.some((item) => dataFromOriginalFile?.path.toLowerCase().includes(item))
        || exclusionList.some((item) => dataFromOriginalFile?.path.includes(item))) {
        errorText = t('common:error:file:file_type_not_support');
      }
      if (errorText) {
        showToast({ content: errorText, type: ToastType.ERROR });
        return Promise.reject(new Error(errorText));
      }

      const croppedImage = await ImagePicker.openCropper({
        mediaType: 'photo',
        width,
        height,
        path: image.path,
      });

      const result: IFilePicked = formatImage(croppedImage);
      return Promise.resolve(result);
    }
    return Promise.reject(new Error('Image not found'));
  } catch (e) {
    return Promise.reject(e);
  }
};

const openPickerMultiple = async (option = {}) => {
  try {
    const images = await ImagePicker.openPicker({
      cropping: false,
      mediaType: 'any',
      multiple: true,
      compressVideoPreset: 'Passthrough',
      forceJpg: true,
      ...option,
    });
    if (images?.length > 0) {
      const result: IFilePicked[] = [];
      images?.map((image) => result.push(formatImage(image)));
      return Promise.resolve(result);
    }
    return Promise.reject(new Error('images not found'));
  } catch (e) {
    return Promise.reject(e);
  }
};

const BeinImagePicker = {
  openPickerSingle,
  openPickerMultiple,
  openPickerSinglePhotoWithCropping,
};

export default BeinImagePicker;
