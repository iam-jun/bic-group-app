import { Auth } from 'aws-amplify';
import { authErrors, forgotPasswordStages } from '~/constants/authConstants';
import i18n from '~/localization';
import showToastError from '~/store/helper/showToastError';
import { IForgotPasswordState } from '..';

const requestResetPassword = (set, _get) => async (email: string) => {
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
    if (error?.code === authErrors.USER_NOT_FOUND_EXCEPTION) {
      set((state: IForgotPasswordState) => {
        state.errorRequest = i18n.t('auth:text_forgot_password_email_not_found');
      }, 'requestResetPasswordError');
    } else {
      if (error?.code === authErrors.LIMIT_EXCEEDED_EXCEPTION) {
        showToastError({ meta: { message: i18n.t('auth:text_err_limit_exceeded') } });
      } else {
        showToastError(error);
      }
      set((state: IForgotPasswordState) => {
        state.errorRequest = '';
      }, 'requestResetPasswordErrorAndShowToast');
    }
    set((state: IForgotPasswordState) => {
      state.loadingRequest = false;
    }, 'requestResetPasswordErrorLoading');
  }
};

export default requestResetPassword;
