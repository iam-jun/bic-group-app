import IBaseState, { InitStateType } from '../interfaces/IBaseState';
import {
  createStore, resetStore,
} from '~/store/utils';
import {
  IAlertModal, IReactionBottomSheet, IPayloadShowModal, IToastMessage,
} from '~/interfaces/common';
import { BottomListProps } from '~/components/BottomList';
import { IPayloadReactionDetailBottomSheet } from '~/interfaces/IModal';

export interface IModalState extends IBaseState {
  toast: IToastMessage | null;
  alert: IAlertModal;
  modal: IPayloadShowModal | null;
  alertNewFeature: { visible: boolean } | null;
  bottomList: BottomListProps | null;
  reactionBottomSheet: IReactionBottomSheet | null;
  reactionDetailBottomSheet: IPayloadReactionDetailBottomSheet | null;
  loadingModal: boolean;

  actions: {
    showToast: (payload: IToastMessage) => void;
    clearToast: () => void;
    showAlert: (payload: IAlertModal) => void;
    hideAlert: () => void;
    showModal: (payload: IPayloadShowModal) => void;
    hideModal: () => void;
    showAlertNewFeature: () => void;
    hideAlertNewFeature: () => void;
    showBottomList: (payload: BottomListProps) => void;
    hideBottomList: () => void;
    setShowReactionBottomSheet: (payload?: IReactionBottomSheet) => void;
    setLoadingModal: (payload: boolean) => void;
    showReactionDetailBottomSheet: (payload: IPayloadReactionDetailBottomSheet) => void;
    clearReactionDetailBottomSheet: () => void;
  };
}

const initialState: InitStateType<IModalState> = {
  toast: null,
  modal: null,
  alertNewFeature: null,
  bottomList: null,
  reactionBottomSheet: null,
  reactionDetailBottomSheet: null,
  loadingModal: false,

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

    hideModal: () => {
      set((state: IModalState) => {
        state.modal = initialState.modal;
      }, 'setHideModal');
    },
    showModal: (payload: IPayloadShowModal) => {
      set((state: IModalState) => {
        state.modal = payload;
      }, 'setShowModal');
    },

    hideAlertNewFeature: () => {
      set((state: IModalState) => {
        state.alertNewFeature = initialState.alertNewFeature;
      }, 'setHideAlertNewFeature');
    },
    showAlertNewFeature: () => {
      set((state: IModalState) => {
        state.alertNewFeature = { visible: true };
      }, 'setShowAlertNewFeature');
    },

    hideBottomList: () => {
      set((state: IModalState) => {
        state.bottomList = initialState.bottomList;
      }, 'setHideBottomList');
    },
    showBottomList: (payload: BottomListProps) => {
      set((state: IModalState) => {
        state.bottomList = {
          ...payload,
          isOpen: true,
        };
      }, 'setShowBottomList');
    },

    setShowReactionBottomSheet: (payload?: IReactionBottomSheet) => {
      set((state: IModalState) => {
        state.reactionBottomSheet = payload || initialState.reactionBottomSheet;
      }, 'setShowReactionBottomSheet');
    },

    setLoadingModal: (payload: boolean) => {
      set((state: IModalState) => {
        state.loadingModal = payload;
      }, 'setLoadingModal');
    },

    showReactionDetailBottomSheet: (payload: IPayloadReactionDetailBottomSheet) => {
      set((state: IModalState) => {
        state.reactionDetailBottomSheet = {
          ...payload,
          isOpen: true,
        };
      }, 'setShowReactionDetailBottomSheet');
    },
    clearReactionDetailBottomSheet: () => {
      set((state: IModalState) => {
        state.reactionDetailBottomSheet = initialState.reactionDetailBottomSheet;
      }, 'setClearReactionDetailBottomSheet');
    },
  },

  reset: () => resetStore(initialState, set),
});

const useModalStore = createStore<IModalState>(modalStore);

export default useModalStore;
