import {Linking, Platform} from 'react-native';
import SharedGroupPreferences from 'react-native-shared-group-preferences';
import {getEnv} from '~/utils/env';
import {chatSchemes} from '~/constants/chat';

type DataType = {
  name?: string; // will save to fullname
  email?: string;
  avatar?: string;
  username?: string;
};

export const saveDataToSharedStorage = async (
  appIdentifier: string,
  key: string,
  data: any,
) => {
  try {
    await SharedGroupPreferences.setItem(key, data, appIdentifier);
  } catch (errorCode) {
    // errorCode 0 = There is no suite with that name
    console.log('saveDataToSharedStorage', errorCode);
  }
};

export const loadFromSharedStorage = async (
  appIdentifier: string,
  key: string,
) => {
  let data = null;
  try {
    data = await SharedGroupPreferences.getItem(key, appIdentifier);
  } catch (errorCode) {
    // errorCode 0 = no group name exists. You probably need to setup your Xcode Project properly.
    // errorCode 1 = there is no value for that key
    console.log('loadFromSharedStorage', errorCode);
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
  return loadFromSharedStorage(
    getEnv(`APP_GROUP_PACKAGE_NAME_${Platform.OS.toUpperCase()}`),
    'pref_user_info',
  );
};

export const updateUserFromSharedPreferences = async (payload: any) => {
  const user = await getUserFromSharedPreferences();

  await saveDataToSharedStorage(
    getEnv(`APP_GROUP_PACKAGE_NAME_${Platform.OS.toUpperCase()}`),
    'pref_user_info',
    {...user, ...payload},
  );
};

export const isAppInstalled = () => {
  return Linking.canOpenURL(chatSchemes.PREFIX_DEEPLINK);
};
