import {Platform} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

type permissionTypes = 'photo';

const PLATFORM_PHOTO_PERMISSIONS = {
  ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
  android: PERMISSIONS.ANDROID.CAMERA,
};
const REQUEST_PERMISSION_TYPE = {
  photo: PLATFORM_PHOTO_PERMISSIONS,
  //  files:
  //    Platform.OS === 'ios'
  //      ? PERMISSIONS.IOS.MEDIA_LIBRARY
  //      : PERMISSIONS.ANDROID.ACCESS_MEDIA_LOCATION,
};

export default class AppPermission {
  static checkPermission = async (type: permissionTypes) => {
    const permissions = REQUEST_PERMISSION_TYPE[type][Platform.OS];
    console.log(
      'permissions>',
      permissions,
      '>>>>>>>',
      PLATFORM_PHOTO_PERMISSIONS.ios,
    );

    if (!permissions) {
      return true;
    }
    try {
      const result = await check(permissions);
      console.log('>>>>>>>RESULT>>>>>>>>', result);
      if (result === RESULTS.GRANTED) return true;
      return AppPermission.requestPermission(type);
    } catch (error) {
      console.log('>>>>>>>PERMISSTION ERROR>>>>>', error);

      return false;
    }
    //   check(!!type ? _permissionTypes[type] : _permissionTypes.photo)
    //     .then(result => {
    //       switch (result) {
    //         case RESULTS.UNAVAILABLE:
    //           console.log(
    //             'This feature is not available (on this device / in this context)',
    //           );
    //           break;
    //         case RESULTS.DENIED:
    //           console.log(
    //             'The permission has not been requested / is denied but requestable',
    //           );
    //           break;
    //         case RESULTS.LIMITED:
    //           console.log('The permission is limited: some actions are possible');
    //           break;
    //         case RESULTS.GRANTED:
    //           console.log('The permission is granted');
    //           break;
    //         case RESULTS.BLOCKED:
    //           console.log('The permission is denied and not requestable anymore');
    //           break;
    //       }
    //     })
    //     .catch(error => {
    //       console.log('>>>>>>>>checkPermission ERROR>>>>>>>>>', error);
    //     });
  };

  static requestPermission = async (type: permissionTypes) => {
    const permissions = REQUEST_PERMISSION_TYPE[type][Platform.OS];
    try {
      const result = await request(permissions);
      console.log('requestPermission>>>>>>>>>>>', result);
      return result === RESULTS.GRANTED;
    } catch (error) {
      console.log('>>>>>>>PERMISSTION ERROR>>>>>', error);
      return false;
    }
  };
}
