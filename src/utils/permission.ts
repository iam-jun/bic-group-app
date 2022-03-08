import {Platform} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

type permissionTypes = 'photo';

const PLATFORM_STORAGE_PERMISSIONS = {
  ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
  android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
};
const REQUEST_PERMISSION_TYPE = {
  photo: PLATFORM_STORAGE_PERMISSIONS,
};

export default class AppPermission {
  static requestPermission = async (type: permissionTypes) => {
    //@ts-ignore
    const permissions = REQUEST_PERMISSION_TYPE[type][Platform.OS];
    try {
      const result = await request(permissions);
      return result;
    } catch (error) {
      console.log('>>>>>>>REQUEST PERMISSION ERROR>>>>>', error);
      return false;
    }
  };

  static checkPermission = async (
    type: permissionTypes,
    dispatch: () => void,
    callback: (canOpenPicker: boolean) => void,
  ) => {
    //@ts-ignore
    const permissions = REQUEST_PERMISSION_TYPE[type][Platform.OS];

    try {
      const result = await check(permissions);
      if (Platform.OS === 'web') {
        callback(true);
        return;
      }
      if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) {
        if (result === RESULTS.DENIED) {
          const request = await AppPermission.requestPermission('photo');
          if (request === RESULTS.GRANTED || request === RESULTS.LIMITED) {
            callback(true);
          } else {
            callback(false);
          }
          return;
        } else {
          dispatch();
        }
        callback(false);
      } else {
        callback(true);
      }
    } catch (error) {
      console.log('>>>>>>>CHECK PERMISSION ERROR>>>>>', error);
      callback(false);
      return false;
    }
  };
}
