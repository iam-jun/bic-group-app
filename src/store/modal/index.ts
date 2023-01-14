import IBaseState from '../interfaces/IBaseState';
import {
  createStore, resetStore,
} from '~/store/utils';
import { IAlertModal, IToastMessage } from '~/interfaces/common';

export interface IModalState extends IBaseState {
  toast: IToastMessage;
  alert: IAlertModal;

  actions: {
    showToast: (payload: IToastMessage) => void;
    clearToast: () => void;
    showAlert: (payload: IAlertModal) => void;
    hideAlert: () => void;
  }
}

const initialState = {
  toast: null,

  alert: {
    visible: false,
    isDismissible: true,
    title: '',
    content: '',
    cancelBtn: false,
    cancelLabel: '',
    confirmLabel: '',
    style: {},
    children: null as React.ReactNode,
    onConfirm: () => {
      // do something
    },
    onCancel: () => {
      // do something
    },
  },
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

    hideAlert: () => {
      set((state: IModalState) => {
        state.alert = initialState.alert;
      }, 'setHideAlert');
    },
    showAlert: (payload: any) => {
      set((state: IModalState) => {
        state.alert = {
          ...state.alert,
          ...payload,
          visible: true,
        };
      }, 'setShowAlert');
    },
  },

  reset: () => resetStore(initialState, set),
});

const useModalStore = createStore<IModalState>(modalStore);

export default useModalStore;
