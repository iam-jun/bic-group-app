import ImagePicker from 'react-native-image-crop-picker';
import {IFilePicked} from '~/interfaces/common';

const formatImage = (image: any) => {
  const fileName = image?.path?.replace?.(/(.+)\/(.+)$/, '$2') || 'bein_image';
  return {
    name: fileName,
    filename: fileName,
    type: image?.mime,
    mime: image?.mime,
    size: image?.size,
    uri: image?.path,
  };
};

const openPickerSingle = async (option = {}) => {
  try {
    const image = await ImagePicker.openPicker({
      cropping: false,
      mediaType: 'any',
      multiple: false,
      compressVideoPreset: 'Passthrough',
      ...option,
    });
    if (image) {
      const result: IFilePicked = formatImage(image);
      return Promise.resolve(result);
    } else {
      return Promise.reject('image not found');
    }
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
      ...option,
    });
    if (images?.length > 0) {
      const result: IFilePicked[] = [];
      images?.map(image => result.push(formatImage(image)));
      return Promise.resolve(result);
    } else {
      return Promise.reject('images not found');
    }
  } catch (e) {
    return Promise.reject(e);
  }
};

const BeinImagePicker = {
  openPickerSingle,
  openPickerMultiple,
};

export default BeinImagePicker;
