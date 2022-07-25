import AsyncStorage from '@react-native-async-storage/async-storage';

const STORE_BEIN = 'STORE_BEIN';

const storeData = async (value:any, key: string): Promise<void> => {
  const storage_Key = `${STORE_BEIN}${key}`;

  if (value) {
    await AsyncStorage.setItem(storage_Key, value.toString());
  } else {
    await AsyncStorage.removeItem(storage_Key);
  }
};

const getData = async (key: string): Promise<string | undefined> => {
  const storage_Key = `${STORE_BEIN}${key}`;

  const value = await AsyncStorage.getItem(storage_Key);
  if (value) {
    return Promise.resolve(value);
  }
};

const removeData = async (key: string): Promise<boolean> => {
  const storage_Key = `${STORE_BEIN}${key}`;

  try {
    await AsyncStorage.removeItem(storage_Key);
    return Promise.resolve(true);
  } catch (error) {
    return Promise.reject(error);
  }
};

const removeAllData = async (
  exception_keys: Array<string>,
): Promise<boolean> => {
  try {
    const all_keys = await AsyncStorage.getAllKeys();
    if (all_keys) {
      // get key of app
      const app_keys = all_keys.filter((value) => {
        const exception_key = value.replace(STORE_BEIN, '');
        if (exception_keys.includes(exception_key)) {
          return false;
        }

        return value.includes(STORE_BEIN);
      });

      // remove keys
      await AsyncStorage.multiRemove(app_keys);
      return Promise.resolve(true);
    }
  } catch (error) {
    return Promise.resolve(false);
  }

  return Promise.resolve(false);
};

const setLanguage = async (language: string): Promise<void> => storeData(language, 'language');

const getLanguage = async (): Promise<string | undefined> => getData('language');

export default {
  getData,
  storeData,
  removeAllData,
  removeData,
  setLanguage,
  getLanguage,
};
