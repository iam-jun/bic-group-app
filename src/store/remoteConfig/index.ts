import getEnv from '~/utils/env';
import { IBaseState, InitStateType } from '~/store/interfaces/IBaseState';
import { createStore, resetStore } from '~/store/utils';
import getRemoteConfig from './actions/getRemoteConfig';

const APP_VERSION = getEnv('APP_VERSION');

export interface IRemoteConfigState extends IBaseState {
  appVersion: string;
  minSupportedVersion: string;
  appStoreUrl: string;
  appStoreUrlChat: string;

  actions: {
    getRemoteConfig: () => void;
  }
}

const initialState: InitStateType<IRemoteConfigState> = {
  appVersion: APP_VERSION,
  minSupportedVersion: APP_VERSION,
  appStoreUrl: '',
  appStoreUrlChat: '',
};

const remoteConfigStore = (set, get) => ({
  ...initialState,

  actions: {
    getRemoteConfig: getRemoteConfig(set, get),
  },

  reset: () => resetStore(initialState, set),
});

const useRemoteConfigStore = createStore<IRemoteConfigState>(remoteConfigStore);

export default useRemoteConfigStore;
