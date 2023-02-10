import { createStore } from '~/store/utils';
import IBaseState from '~/store/interfaces/IBaseState';
import { IVerifyEmail } from '~/interfaces/IAuth';
import resendVerifyEmail from './actions/resendVerifyEmail';

export interface IVerifyEmailState extends IBaseState {
  sentVerifyEmail: boolean;
  actions: {
    setSentVerifyEmail: (sent: boolean) => void;
    resendVerifyEmail: (params: IVerifyEmail,) => void;
  }
}

const verifyEmailController = (set, get) => ({
  sentVerifyEmail: false,
  actions: {
    setSentVerifyEmail: (sent: boolean) => {
      set((state: IVerifyEmailState) => {
        state.sentVerifyEmail = sent;
      }, 'setSentVerifyEmail');
    },
    resendVerifyEmail: resendVerifyEmail(set, get),
  },
});

const useVerifyEmailController = createStore<IVerifyEmailState>(verifyEmailController);

export default useVerifyEmailController;
