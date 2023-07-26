import remoteConfig from '@react-native-firebase/remote-config';
import getEnv from '~/utils/env';
import { IRemoteConfigState } from '..';

const APP_VERSION = getEnv('APP_VERSION');

const REMOTE_CONFIG_SETTINGS = {
  minimumFetchIntervalMillis: Number(getEnv('REMOTE_CONFIG_CACHE_TIME')),
  fetchTimeMillis: 10000,
};

const getRemoteConfig = (set, _get) => async () => {
  try {
    await remoteConfig().setConfigSettings(REMOTE_CONFIG_SETTINGS);
    await remoteConfig().setDefaults({
      appVersion: APP_VERSION,
      minSupportedAppVersion: APP_VERSION,
      appStoreUrl: '',
    });
    await remoteConfig().fetchAndActivate();

    set((state: IRemoteConfigState) => {
      state.appVersion = remoteConfig().getValue('appVersion').asString();
      state.minSupportedVersion = remoteConfig().getValue('minSupportedAppVersion').asString();
      state.appStoreUrl = remoteConfig().getValue('appStoreUrl').asString();
      state.appStoreUrlChat = remoteConfig().getValue('appStoreUrlChat').asString();
    }, 'getRemoteConfigSuccess');
  } catch (e) {
    console.error('\x1b[35m🐣️ getRemoteConfig exception ', e, '\x1b[0m');
  }
};

export default getRemoteConfig;
