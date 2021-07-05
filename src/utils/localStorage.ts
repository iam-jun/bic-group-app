import AsyncStorage from '@react-native-async-storage/async-storage';
import {IUser} from '~/interfaces/IAuth';

export const setUser = async (user: IUser) => {
  await AsyncStorage.setItem('user', JSON.stringify(user));
};

export const removeUser = async () => {
  await AsyncStorage.removeItem('user');
};

export const getUser = async (): Promise<IUser | undefined> => {
  try {
    const _user = await AsyncStorage.getItem('user');
    return JSON.parse(_user || '') as IUser;
  } catch (err) {}
  return undefined;
};

export const setLanguage = async (language: string) => {
  await AsyncStorage.setItem('language', language);
};

export const getLanguage = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('language');
};
