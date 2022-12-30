import IBaseState from '../interfaces/IBaseState';
import {
  createStore, resetStore,
} from '~/store/utils';
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

const modalStore = (set, get) => ({
  ...initialState,

  actions: {
    clearToast: () => {
      const { toast } = get();
      const { timeout } = toast || {};
      timeout && clearTimeout(timeout);

      set((state: IModalState) => {
        state.toast = initialState.toast;
      }, 'setClearToast');
    },
    showToast: (payload: IToastMessage) => {
      // clear current timeout toast in case there are multiple toast popup
      const { toast, actions } = get();
      const { timeout } = toast || {};
      timeout && clearTimeout(timeout);

      const delayTimeToHideToast = payload?.duration || 5000;
      set((state: IModalState) => {
        state.toast = {
          ...payload,
          timeout: setTimeout(() => {
            actions.clearToast();
          }, delayTimeToHideToast),
        };
      }, 'setShowToast');
    },
  },

  reset: () => resetStore(initialState, set),
});

const useModalStore = createStore<IModalState>(modalStore);

export default useModalStore;
