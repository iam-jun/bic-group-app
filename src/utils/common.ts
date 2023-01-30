import { Linking, Platform } from 'react-native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import i18next from 'i18next';
import RNFetchBlob from 'rn-fetch-blob';
import Clipboard from '@react-native-clipboard/clipboard';
import { PastedFile } from 'react-native-paste-image-input';
import { linkRegex } from '~/constants/commonRegex';
import { IToastMessage } from '~/interfaces/common';
import Store from '~/storeRedux';
import { checkPermission, permissionTypes } from './permission';
import showToast from '~/store/helper/showToast';
import showAlert from '~/store/helper/showAlert';

export const generateAvatar = (
  name?: string, color?: string,
) => `https://ui-avatars.com/api/?name=${
  name?.toUpperCase() || ''
}&background=${color || '4c95ff'}&color=fff&size=128`;

export function timeOut(ms = 100) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function titleCase(str: string | undefined) {
  if (!str) return str;
  const splitStr = str.toLowerCase().split(' ');
  for (let i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(' ');
}

export function parseSafe(str?: string) {
  let result;
  if (typeof str === 'object') {
    return str;
  }
  if (str) {
    try {
      result = JSON.parse(str);
    } catch (e) {
      console.error(
        '\x1b[35m🐣️ common parseSafe: ', e, '\x1b[0m',
      );
    }
  }
  return result;
}

export const getUrlFromText = (text = '', inputArray = []) => {
  if (!text) return inputArray;
  const urls = text.match(linkRegex);
  if (urls && urls.length > 0) {
    const newArray = [...inputArray];
    newArray.push(urls[0]);
    const newText = text.replace(urls[0], '');
    return getUrlFromText(newText, newArray);
  }
  return inputArray;
};

export const searchText = (
  keyword: string, text: string,
):boolean => {
  if (!text) return false;

  const newTextWithoutVietnamese = nonAccentVietnamese(text);
  const newKeywordWithoutVietnamese = nonAccentVietnamese(keyword);

  return newTextWithoutVietnamese.includes(newKeywordWithoutVietnamese);
};

export const nonAccentVietnamese = (str: string) => {
  let text = str.toLowerCase();

  text = text.replace(
    /à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a',
  );
  text = text.replace(
    /è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e',
  );
  text = text.replace(
    /ì|í|ị|ỉ|ĩ/g, 'i',
  );
  text = text.replace(
    /ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o',
  );
  text = text.replace(
    /ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u',
  );
  text = text.replace(
    /ỳ|ý|ỵ|ỷ|ỹ/g, 'y',
  );
  text = text.replace(
    /đ/g, 'd',
  );
  // Some system encode vietnamese combining accent as individual utf-8 characters
  text = text.replace(
    /\u0300|\u0301|\u0303|\u0309|\u0323/g, '',
  ); // Huyền sắc hỏi ngã nặng
  text = text.replace(
    /\u02C6|\u0306|\u031B/g, '',
  ); // Â, Ê, Ă, Ơ, Ư
  return text;
};

export const getWebDomain = (
  _url: any, _subdomain: boolean,
) => {
  const subdomain = _subdomain || false;

  let url = _url.replace(
    /(https?:\/\/)?(www.)?/i, '',
  );

  if (!subdomain) {
    url = url.split('.');

    url = url.slice(url.length - 2).join('.');
  }

  if (url.indexOf('/') !== -1) {
    return url.split('/')[0];
  }

  return url;
};
/** NOTE: do not use this function for our app bc we handle special case
 * in socket event and when have any response from BE */
// /**
//  * all data from backend send to client must be snake_case
//  * so we have to convert it to camelCase for use in client's code
//  * @param key
//  */
// export const convertReactKeyFromResponse = (key?: string) => {
//   return key ? camelize(key) : '';
// };

// /**
//  * before send react key to backend, we must convert it back to snake_case
//  * @param key
//  */
// export const convertReactKeyForRequest = (key?: string) => {
//   return key ? decamelize(key) : '';
// };

export const downloadImageiOS = (photo: any) => {
  const onPermissionGranted = () => {
    CameraRoll.save(photo?.url, { type: 'photo' }).then(() => {
      const toastMessage: IToastMessage = {
        content: i18next.t('common:text_downloaded'),
      };
      showToast(toastMessage);
    });
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

  checkPermission(permissionTypes.AddPhoto, Store.store.dispatch, onCallback, false);
};

export const downloadImageAndroid = (photo: any) => {
  const onPermissionGranted = () => {
    const path = `${RNFetchBlob.fs.dirs.PictureDir}/${photo?.name}`;
    RNFetchBlob.config({
      path,
    }).fetch('GET', photo?.url).then(() => {
      RNFetchBlob.fs.scanFile([{ path }]);
      const toastMessage: IToastMessage = {
        content: i18next.t('common:text_downloaded'),
      };
      showToast(toastMessage);
    });
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

  checkPermission(permissionTypes.AddPhoto, Store.store.dispatch, onCallback, false);
};

export const downloadImage = (photo: any) => {
  if (!photo) return;

  if (Platform.OS === 'ios') {
    downloadImageiOS(photo);
  } else {
    downloadImageAndroid(photo);
  }
};

export const copyImageFromUrl = (url: string) => {
  if (!url) return;

  let imagePath = null;
  RNFetchBlob.config({
    fileCache: true,
  }).fetch('GET', url).then((res) => {
    imagePath = res.path();
    return res.readFile('base64');
  }).then((base64Data) => {
    RNFetchBlob.fs.unlink(imagePath);
    Clipboard.setImage(base64Data);
    const toastMessage: IToastMessage = {
      content: i18next.t('common:copied'),
    };
    showToast(toastMessage);
  });
};

export const getImagePastedFromClipboard = (files) => {
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
