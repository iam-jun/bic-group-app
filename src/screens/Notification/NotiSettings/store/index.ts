import IBaseState from '~/store/interfaces/IBaseState';
import {
  createStore,
} from '~/store/utils';
import { IEditNotificationSetting, INotiSettings } from '~/interfaces/INotification';
import getConfigSettings from './actions/getConfigSettings';
import updateSettings from './actions/updateSettings';

export interface INotiSettingsStore extends IBaseState {
  data: { [name: string]: INotiSettings };
  loading: boolean;
  loadingUpdate: boolean;
  isRefreshing: boolean;

  actions: {
   getConfigSettings: (isRefreshing?: boolean) =>void;
   updateSettings: (
    params: IEditNotificationSetting,
    dataUpdateStore: INotiSettings) => void;
  }
}

const initialState = {
  data: {},
  loading: true,
  loadingUpdate: false,
  isRefreshing: false,
};

const notiSettingsStore = (set, get) => ({
  ...initialState,
  actions: {
    getConfigSettings: getConfigSettings(set, get),
    updateSettings: updateSettings(set, get),
  },
});

const useNotiSettingsStore = createStore<INotiSettingsStore>(notiSettingsStore);

export default useNotiSettingsStore;
