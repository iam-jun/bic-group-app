import SharedGroupPreferences from 'react-native-shared-group-preferences';
import {getEnv} from '~/utils/env';

export const saveDataToSharedStorage = async (key: string, data: any) => {
  try {
    await SharedGroupPreferences.setItem(key, data, getEnv('APP_PACKAGE_NAME'));
  } catch (errorCode) {
    // errorCode 0 = There is no suite with that name
    console.log('saveDataToSharedStorage', errorCode);
  }
};

export const loadFromSharedStorage = async (key: string) => {
  let data = null;
  try {
    data = await SharedGroupPreferences.getItem(
      key,
      getEnv('APP_PACKAGE_NAME'),
    );
  } catch (errorCode) {
    // errorCode 0 = no group name exists. You probably need to setup your Xcode Project properly.
    // errorCode 1 = there is no value for that key
    console.log('loadFromSharedStorage', errorCode);
  }
  return data;
};

export const saveUserToSharedPreferences = async (payload: any) => {
  await saveDataToSharedStorage('pref_user_info', payload);
};

export const getUserFromSharedPreferences = async () => {
  return await loadFromSharedStorage('pref_user_info');
};

export const updateUserFromSharedPreferences = async (payload: any) => {
  const user = await getUserFromSharedPreferences();
  await saveDataToSharedStorage('pref_user_info', {...user, ...payload});
};
