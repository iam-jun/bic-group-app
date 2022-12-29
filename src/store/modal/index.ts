import IBaseState from '../interfaces/IBaseState';
import {
  createStore, resetStore,
} from '~/store/utils';
import { timeOut } from '~/utils/common';
import { IToastMessage } from '~/interfaces/common';

export interface IModalState extends IBaseState {
  toast: IToastMessage;

  actions: {
    showToast: (payload: IToastMessage) => void;
    clearToast: () => void;
  }
}

const initialState = {
  toast: null,
};

const modalStore = (set, _get) => ({
  ...initialState,
  actions: {
    clearToast: () => {
      set((state: IModalState) => {
        state.toast = initialState.toast;
      });
    },
    showToast: async (payload: IToastMessage) => {
      set((state: IModalState) => {
        state.toast = payload;
      });
      await timeOut(payload?.duration || 5000);
      set((state: IModalState) => {
        state.toast = initialState.toast;
      });
    },
  },

  reset: () => resetStore(initialState, set),
});

const useModalStore = createStore<IModalState>(modalStore);

export default useModalStore;
