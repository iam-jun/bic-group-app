import { Linking, Platform } from 'react-native';
import i18next from 'i18next';
import RNFetchBlob from 'rn-fetch-blob';
import Clipboard from '@react-native-clipboard/clipboard';
import { PastedFile } from 'react-native-paste-image-input';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { IFilePicked, IToastMessage } from '~/interfaces/common';
import { checkPermission, PermissionTypes } from '../permission';
import showToast from '~/store/helper/showToast';
import showAlert from '~/store/helper/showAlert';
import { ToastType } from '~/baseComponents/Toast/BaseToast';
import { formatBytes } from '../formatter';
import { AppConfig } from '~/configs';

const downloadImageiOS = (photo: any) => {
  const onPermissionGranted = async () => {
    await CameraRoll.save(photo?.url, { type: 'photo' });
    const toastMessage: IToastMessage = {
      content: i18next.t('common:text_downloaded'),
    };

    showToast(toastMessage);
  };

  const onPermissionRefused = () => {
    showAlert({
      title: i18next.t('error:alert_title'),
      content: i18next.t('common:permission_add_photo_blocked'),
      cancelBtn: true,
      confirmLabel: i18next.t('common:text_go_to_settings'),
      onConfirm: () => {
        Linking.openSettings();
      },
    });
  };

  const onCallback = (isGranted: boolean) => {
    if (isGranted) {
      onPermissionGranted();
    } else {
      onPermissionRefused();
    }
  };

  checkPermission(PermissionTypes.AddPhoto, onCallback, false);
};

const downloadImageAndroid = (photo: any) => {
  const onPermissionGranted = async () => {
    try {
      const path = `${RNFetchBlob.fs.dirs.PictureDir}/${photo?.name}`;
      await RNFetchBlob.config({ path }).fetch('GET', photo?.url);
      await RNFetchBlob.fs.scanFile([{ path }]);
      const toastMessage: IToastMessage = {
        content: i18next.t('common:text_downloaded'),
      };

      showToast(toastMessage);
    } catch (error) {
      console.error('downloadImageAndroid error: ', error);
    }
  };

  const onPermissionRefused = () => {
    showAlert({
      title: i18next.t('error:alert_title'),
      content: i18next.t('common:permission_add_photo_blocked'),
      cancelBtn: true,
      confirmLabel: i18next.t('common:text_go_to_settings'),
      onConfirm: () => Linking.openSettings(),
    });
  };

  const onCallback = (isGranted: boolean) => {
    if (isGranted) {
      onPermissionGranted();
    } else {
      onPermissionRefused();
    }
  };

  checkPermission(PermissionTypes.AddPhoto, onCallback, false);
};

export const downloadImage = (photo: any) => {
  if (!photo) return;

  if (Platform.OS === 'ios') {
    downloadImageiOS(photo);
  } else {
    downloadImageAndroid(photo);
  }
};

export const copyImageFromUrl = async (url: string) => {
  if (!url) return;

  try {
    const response = await RNFetchBlob.config({ fileCache: true }).fetch('GET', url);
    const imagePath = response.path();
    const base64Data = await response.readFile('base64');

    RNFetchBlob.fs.unlink(imagePath);
    Clipboard.setImage(base64Data);

    const toastMessage: IToastMessage = {
      content: i18next.t('common:copied'),
    };
    showToast(toastMessage);
  } catch (error) {
    console.error('copyImageFromUrl error:', error);
  }
};

export const getImagePastedFromClipboard = (files: any[]) => {
  const imgs = files.filter((file) => !file.error);
  if (imgs && imgs.length > 0) {
    const img: PastedFile = {
      fileName: imgs[0].fileName,
      type: imgs[0].type,
      fileSize: imgs[0].fileSize,
      uri: imgs[0].uri,
    };
    return img;
  }
  return null;
};

export const checkFileSelected = (file: IFilePicked) => {
  if (Platform.OS === 'ios') {
    if (file?.sourceURL?.includes('GIF') || file?.sourceURL?.includes('WEBP')) {
      const error = i18next.t('common:error:file:file_type_not_support');
      showToast({ content: error, type: ToastType.ERROR });
      return false;
    }
  }

  if (file?.size > AppConfig.groupImageMaxSize) {
    const error = i18next.t('common:error:file:file_exceed_limit').replace('{n}', formatBytes(AppConfig.groupImageMaxSize, 0));
    showToast({ content: error, type: ToastType.ERROR });
    return false;
  }

  return true;
};
