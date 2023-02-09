import { Auth } from 'aws-amplify';
import { forgotPasswordStages } from '~/constants/authConstants';
import { IForgotPasswordState } from '..';

const requestResetPassword = (set, _get) => async (email: string, callbackError?: (error: any)=> void) => {
  if (!email) return;
  try {
    set((state: IForgotPasswordState) => {
      state.errorRequest = '';
      state.loadingRequest = true;
    }, 'requestResetPassword');

    await Auth.forgotPassword(email);

    set((state: IForgotPasswordState) => {
      state.loadingRequest = false;
      state.screenCurrentStage = forgotPasswordStages.INPUT_CODE_PW;
    }, 'requestResetPasswordSuccess');
  } catch (error) {
    callbackError?.(error);
    set((state: IForgotPasswordState) => {
      state.loadingRequest = false;
    }, 'requestResetPasswordErrorLoading');
  }
};

export default requestResetPassword;
