import { createStore } from '~/store/utils';
import IBaseState from '~/store/interfaces/IBaseState';
import { IVerifyEmail } from '~/interfaces/IAuth';
import resendVerifyEmail from './actions/resendVerifyEmail';

export interface IVerifyEmailState extends IBaseState {

  actions: {
     resendVerifyEmail: (params: IVerifyEmail) => void;
  }
}

const useForgotPassword = (set, get) => ({
  actions: {
    resendVerifyEmail: resendVerifyEmail(set, get),

  },
});

const useVerifyEmailController = createStore<IVerifyEmailState>(useForgotPassword);

export default useVerifyEmailController;
