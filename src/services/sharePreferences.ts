import {Platform} from 'react-native';
import SharedGroupPreferences from 'react-native-shared-group-preferences';
import {saveCookie} from '~/utils/cookie';
import {getEnv} from '~/utils/env';

type DataType = {
  name?: string; // will save to fullname
  email?: string;
  avatar?: string;
  username?: string;
};

const saveDataToCookie = (data: DataType) => {
  const {name, email, avatar, username} = data;

  if (name) {
    saveCookie('BUSER_FULLNAME', name);
  }

  if (email) {
    saveCookie('BUSER_EMAIL', email);
  }

  if (username) {
    saveCookie('BUSER_USERNAME', username);
  }

  if (avatar) {
    saveCookie('BUSER_AVATAR', avatar);
  }
};

export const saveDataToSharedStorage = async (
  appIdentifier: string,
  key: string,
  data: any,
) => {
  if (Platform.OS === 'web') {
    saveDataToCookie(data);
    return null;
  }

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
  // TODO - extract data from cookie if need to do reverse flow from chat to community
  if (Platform.OS === 'web') return null;

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
