import remoteConfig from '@react-native-firebase/remote-config';
import getEnv from '~/utils/env';
import { IRemoteConfigState } from '..';

const APP_VERSION = getEnv('APP_VERSION');

const REMOTE_CONFIG_SETTINGS = {
  minimumFetchIntervalMillis: Number(getEnv('REMOTE_CONFIG_CACHE_TIME')),
};

const getRemoteConfig = (set, _get) => async () => {
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
  }, 'getRemoteConfigSuccess');
};

export default getRemoteConfig;
