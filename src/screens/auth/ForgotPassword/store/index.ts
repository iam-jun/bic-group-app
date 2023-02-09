import { createStore, resetStore } from '~/store/utils';
import requestResetPassword from './actions/requestResetPassword';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { IForgotPasswordConfirm } from '~/interfaces/IAuth';
import confirmForgotPassword from './actions/confirmForgotPassword';
import { forgotPasswordStages } from '~/constants/authConstants';

export interface IForgotPasswordState extends IBaseState {
  screenCurrentStage: string;
  errorRequest: string;
  errorConfirm: string;
  loadingRequest: boolean;
  loadingConfirm: boolean;

  actions: {
    setScreenCurrentStage: (stage: string) => void;
    setErrorRequest: (error?: string) => void;
    setErrorConfirm: (error?: string) => void;
    requestResetPassword: (email: string, callbackError?: (error: any)=> void) => void;
    confirmForgotPassword: (payload: IForgotPasswordConfirm) => void;
  }
}

const initialState: InitStateType<IForgotPasswordState> = {
  screenCurrentStage: forgotPasswordStages.INPUT_ID,
  errorRequest: '',
  errorConfirm: '',
  loadingRequest: false,
  loadingConfirm: false,
};

const useForgotPassword = (set, get) => ({
  ...initialState,
  actions: {
    setScreenCurrentStage: (stage: string) => {
      set((state: IForgotPasswordState) => {
        state.screenCurrentStage = stage;
      }, 'setScreenCurrentStage');
    },
    setErrorRequest: (error?: string) => {
      set((state: IForgotPasswordState) => {
        state.errorRequest = error || initialState.errorRequest;
      }, 'setErrorRequest');
    },
    setErrorConfirm: (error?: string) => {
      set((state: IForgotPasswordState) => {
        state.errorConfirm = error || initialState.errorConfirm;
      }, 'setErrorConfirm');
    },
    requestResetPassword: requestResetPassword(set, get),
    confirmForgotPassword: confirmForgotPassword(set, get),
  },
  reset: () => resetStore(initialState, set),
});

const useForgotPasswordStore = createStore<IForgotPasswordState>(useForgotPassword);

export default useForgotPasswordStore;
