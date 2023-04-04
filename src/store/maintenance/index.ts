import IBaseState, { InitStateType } from '../interfaces/IBaseState';
import { createStore, resetStore } from '~/store/utils';

import { IMaintenanceData } from '~/interfaces/IMaintenance';

export interface IMaintenanceState extends IBaseState {
  data: IMaintenanceData;
}

const initialState: InitStateType<IMaintenanceState> = {
  data: null,
};

const modalStore = (set, _get) => ({
  ...initialState,

  actions: {
    setData: (payload: IMaintenanceData) => {
      set((state: IMaintenanceState) => {
        state.data = payload;
      }, 'setMaintenanceData');
    },
  },

  reset: () => resetStore(initialState, set),
});

const useMaintenanceStore = createStore<IMaintenanceState>(modalStore);

export default useMaintenanceStore;
