import { Platform } from 'react-native';
import uuid from 'react-native-uuid';
import ImagePicker from 'react-native-image-crop-picker';
import { IFilePicked } from '~/interfaces/common';

const changeExtension = (fileName, newExtension) => {
  const parts = fileName.split('.');
  parts[parts.length - 1] = newExtension;
  const newFileName = parts.join('.');

  return newFileName;
};

const formatImage = (image: any) => {
  const isIos = Platform.OS === 'ios';
  const isGif = image?.mime?.includes('gif') || image?.mime?.includes('GIF');
  const isHEIC = image?.mime?.includes('heic') || image?.mime?.includes('HEIC');
  const isHEIF = image?.mime?.includes('heif') || image?.mime?.includes('HEIF');

  const pathName = image?.path?.replace?.(
    /(.+)\/(.+)$/, '$2',
  ) || 'bein_image';

  const fileName = (isIos && isGif) ? changeExtension(pathName, 'gif') : uuid.v4() + pathName;
  const uri = (isIos && isGif) ? image?.sourceURL : image?.path;
  const mimeType = (isHEIC || isHEIF) ? 'image/jpeg' : image?.mime;

  return {
    name: fileName,
    filename: fileName,
    type: mimeType,
    mime: mimeType,
    size: image?.size,
    uri: uri,
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
      // forceJpg: true,
      ...option,
    });
    if (image) {
      const result: IFilePicked = formatImage(image);
      return Promise.resolve(result);
    }
    return Promise.reject(new Error('image not found'));
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
      // forceJpg: true,
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
};

export default BeinImagePicker;
