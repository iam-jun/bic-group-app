import { createStore } from '~/store/utils';
import IBaseState from '~/store/interfaces/IBaseState';
import { IVerifyEmail } from '~/interfaces/IAuth';
import resendVerifyEmail from './actions/resendVerifyEmail';
import confirmSignUp from './actions/confirmSignUp';

export interface IVerifyEmailState extends IBaseState {
  sentVerifyEmail: boolean;
  loadingConfirmSiginUp: boolean;
  linkIsExpired: boolean;
  actions: {
    setSentVerifyEmail: (sent: boolean) => void;
    setLoadingConfirmSignUp: (loading: boolean) => void;
    setLinkIsExpired: (value: boolean) => void;
    resendVerifyEmail: (params: IVerifyEmail,) => void;
    confirmSignUp: (username: string, code: string,) => void;
  }
}

const verifyEmailController = (set, get) => ({
  sentVerifyEmail: false,
  linkIsExpired: false,
  loadingConfirmSiginUp: true,
  actions: {
    setSentVerifyEmail: (sent: boolean) => {
      set((state: IVerifyEmailState) => {
        state.sentVerifyEmail = sent;
      }, 'setSentVerifyEmail');
    },
    setLoadingConfirmSignUp: (loading: boolean) => {
      set((state: IVerifyEmailState) => {
        state.loadingConfirmSiginUp = loading;
      }, 'setLoadingConfirmSignUp');
    },
    setLinkIsExpired: (value: boolean) => {
      set((state: IVerifyEmailState) => {
        state.linkIsExpired = value;
      }, 'setLinkIsExpired');
    },
    resendVerifyEmail: resendVerifyEmail(set, get),
    confirmSignUp: confirmSignUp(set, get),
  },
});

const useVerifyEmailController = createStore<IVerifyEmailState>(verifyEmailController);

export default useVerifyEmailController;
