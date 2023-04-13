import IBaseState, { InitStateType } from '../interfaces/IBaseState';
import { createStore, resetStore } from '~/store/utils';

import { IMaintenanceData } from '~/interfaces/IMaintenance';
import checkMaintenance from './actions/checkMaintenance';

export interface IMaintenanceState extends IBaseState {
  data: IMaintenanceData;

  actions: {
    checkMaintenance: (isRefreshing?: boolean) => Promise<void>;
    setData: (payload: IMaintenanceData) => void;
  };
}

const initialState: InitStateType<IMaintenanceState> = {
  data: null,
};

const maintenanceStore = (set, get) => ({
  ...initialState,

  actions: {
    setData: (payload: IMaintenanceData) => {
      set((state: IMaintenanceState) => {
        state.data = payload;
      }, 'setMaintenanceData');
    },
    checkMaintenance: checkMaintenance(set, get),
  },

  reset: () => resetStore(initialState, set),
});

const useMaintenanceStore = createStore<IMaintenanceState>(maintenanceStore);

export default useMaintenanceStore;
