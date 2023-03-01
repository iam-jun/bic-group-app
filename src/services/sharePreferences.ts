import { Linking, Platform } from 'react-native';
import SharedGroupPreferences from 'react-native-shared-group-preferences';
import getEnv from '~/utils/env';
import { chatSchemes } from '~/constants/chat';

export const saveDataToSharedStorage = async (
  appIdentifier: string,
  key: string,
  data: any,
) => {
  try {
    await SharedGroupPreferences.setItem(
      key, data, appIdentifier,
    );
  } catch (errorCode) {
    // errorCode 0 = There is no suite with that name
    console.error(
      'saveDataToSharedStorage error', errorCode,
    );
  }
};

export const loadFromSharedStorage = async (
  appIdentifier: string,
  key: string,
) => {
  let data = null;
  try {
    data = await SharedGroupPreferences.getItem(
      key, appIdentifier,
    );
  } catch (errorCode) {
    // errorCode 0 = no group name exists. You probably need to setup your Xcode Project properly.
    // errorCode 1 = there is no value for that key
    console.error(
      'loadFromSharedStorage', errorCode,
    );
  }
  return data;
};

export const saveUserToSharedPreferences = async (payload: any) => {
  await saveDataToSharedStorage(
    getEnv(`APP_GROUP_PACKAGE_NAME_${Platform.OS.toUpperCase()}`),
    'pref_user_info',
    payload,
  );
};

export const getUserFromSharedPreferences = () => {
  /**
   * Only get authen session from chat on android
   * because limitation of SharedProvider can only save when app installed
   */
  const appChatPackageName = getEnv('APP_CHAT_PACKAGE_NAME_ANDROID');
  const packageName = Platform.OS === 'ios' ? getEnv('APP_GROUP_PACKAGE_NAME_IOS') : appChatPackageName;

  return loadFromSharedStorage(packageName, 'pref_user_info');
};

export const updateUserFromSharedPreferences = async (payload: any) => {
  // get own user information
  const user = await loadFromSharedStorage(getEnv(`APP_GROUP_PACKAGE_NAME_${Platform.OS.toUpperCase()}`), 'pref_user_info');

  await saveUserToSharedPreferences({ ...user, ...payload });
};

export const isAppInstalled = () => Linking.canOpenURL(chatSchemes.PREFIX_DEEPLINK);

export const clearAllSharedPreferences = async () => {
  if (Platform.OS === 'ios') {
    await saveDataToSharedStorage(getEnv('APP_GROUP_PACKAGE_NAME_IOS'), 'pref_user_info', null);
  } else {
    await saveDataToSharedStorage(getEnv('APP_GROUP_PACKAGE_NAME_ANDROID'), 'pref_user_info', null);
  }
};
