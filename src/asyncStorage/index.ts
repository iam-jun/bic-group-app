import {ISignIn} from './../store/auth/interfaces';
import AsyncStorage from '@react-native-community/async-storage';

export const setUser = async (user: ISignIn) => {
  await AsyncStorage.setItem('user', JSON.stringify(user));
};

export const removeUser = async () => {
  await AsyncStorage.removeItem('user');
};

export const getUser = async (): Promise<ISignIn | undefined> => {
  try {
    const _user = await AsyncStorage.getItem('user');
    return JSON.parse(_user || '') as ISignIn;
  } catch (err) {}
  return undefined;
};
