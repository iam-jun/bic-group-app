import {Platform} from 'react-native';
import deviceInfoModule from 'react-native-device-info';
import appConfig from '~/configs/appConfig';
import {IFilePicked} from '~/interfaces/common';
import {IActivityDataFile, IActivityDataImage} from '~/interfaces/IPost';
import i18n from '~/localization';
import FileUploader from '~/services/fileUploader';
import {showHideToastMessage} from '~/store/modal/actions';
import {
  CONTENT_INSET_HEIGHT,
  CONTENT_MIN_HEIGHT,
  TOAST_MIN_HEIGHT,
} from './constanst';
import useInputHeight from './hooks/useInputHeight';
import ImageUploader from '~/services/imageUploader';

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
        ImageUploader.getInstance().getFile(fileName) || {};
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
    const {uploading, result} = FileUploader.getInstance().getFile(filename);
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

export const calculateInputHeight = (
  inputHeight: number,
  photosHeight: number,
  isShowToastAutoSave: boolean,
  isKeyboardOpen: boolean,
): number => {
  const {minInputHeight, maxInputHeight} = useInputHeight();
  const isAnimated = isAndroidAnimated();
  let newInputHeight = inputHeight;
  if (isAnimated && newInputHeight > maxInputHeight) {
    newInputHeight = maxInputHeight;
  }
  if (isAnimated) {
    newInputHeight =
      isKeyboardOpen && newInputHeight > minInputHeight
        ? minInputHeight
        : newInputHeight;
  }
  const toastHeight = isShowToastAutoSave ? TOAST_MIN_HEIGHT : 0;
  const newHeight = Math.max(
    newInputHeight + CONTENT_INSET_HEIGHT + photosHeight + toastHeight,
    CONTENT_MIN_HEIGHT + photosHeight + toastHeight,
  );

  return newHeight;
};

export const isAndroidAnimated = () => {
  let deviceVersion = 0;

  const isAndroid = Platform.OS === 'android';
  if (isAndroid) {
    const systemVersion = deviceInfoModule.getSystemVersion();
    deviceVersion = parseInt(systemVersion);
  }
  return isAndroid && deviceVersion === 8;
};

export const validateFiles = (selectingFiles: IFilePicked[], t: any) => {
  let fileError = '';
  let fileUploading = false;
  const files: IActivityDataFile[] = [];

  selectingFiles?.map?.((item: any) => {
    if (item?.url) {
      files.push({
        ...item,
        id: item?.id,
        name: item?.name || item?.fileName || '',
        origin_name: item?.name,
      });
    } else {
      const {url, uploading, result} =
        FileUploader.getInstance().getFile(item.name) || {};
      if (uploading) {
        fileUploading = true;
        fileError = t('post:error_wait_uploading');
      } else if (!url) {
        fileError = t('post:error_upload_failed');
      }
      files.push({
        ...result,
        ...item,
        origin_name: item.name,
      });
    }
  });
  return {fileError, files, fileUploading};
};

export const validateFilesPicker = (
  files: IFilePicked[],
  totalFiles: number,
  totalSize: number,
  dispatch: any,
): IFilePicked[] => {
  let toastMessage: string | null = null;

  const remainningFilesCount = appConfig.maxFiles - totalFiles;

  let results: IFilePicked[] = [];

  let size = 0;

  files.forEach((file: IFilePicked) => {
    if (size + file.size + totalSize <= appConfig.totalFileSize) {
      size += file.size;
      results.push(file);
    }
  });

  if (results.length < files.length)
    toastMessage = i18n.t('upload:text_file_over_size');

  if (results.length > remainningFilesCount) {
    toastMessage = i18n.t('upload:text_file_over_length', {
      max_files: appConfig.maxFiles,
    });

    results = results.slice(0, remainningFilesCount);
  }

  if (toastMessage)
    dispatch(
      showHideToastMessage({
        content: toastMessage,
        props: {
          type: 'error',
        },
      }),
    );

  return results;
};

export const clearExistingFiles = (
  files: IFilePicked[],
  newFiles: IFilePicked[],
): IFilePicked[] => {
  const fileResult: IFilePicked[] = [];
  newFiles.forEach(newFile => {
    let isExisting = false;

    files.some(file => {
      if (newFile.name === file.name && newFile.size === file.size) {
        isExisting = true;
        return;
      }
    });

    if (!isExisting) {
      fileResult.push(newFile);
    }
  });
  return fileResult;
};
