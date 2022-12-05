import { Auth } from 'aws-amplify';
import i18n from 'i18next';
import { authErrors, forgotPasswordStages } from '~/constants/authConstants';
import { IForgotPasswordConfirm } from '~/interfaces/IAuth';
import showError from '~/store/helper/showError';
import { IForgotPasswordState } from '..';

const confirmForgotPassword = (set, _get) => async (payload: IForgotPasswordConfirm) => {
  const { code, email, password } = payload;
  try {
    set((state: IForgotPasswordState) => {
      state.errorConfirm = '';
      state.loadingConfirm = true;
    }, 'confirmForgotPassword');

    await Auth.forgotPasswordSubmit(
      email, code, password,
    );

    set((state: IForgotPasswordState) => {
      state.screenCurrentStage = forgotPasswordStages.COMPLETE;
      state.loadingConfirm = false;
    }, 'confirmForgotPasswordSuccess');
  } catch (error) {
    switch (error.code) {
      case authErrors.CODE_MISMATCH_EXCEPTION:
        set((state: IForgotPasswordState) => {
          state.errorConfirm = i18n.t('auth:text_err_wrong_code');
          state.loadingConfirm = false;
        }, 'confirmForgotPasswordFailCode');
        break;
      case authErrors.LIMIT_EXCEEDED_EXCEPTION:
        showError({ meta: { message: i18n.t('auth:text_err_limit_exceeded') } });
        set((state: IForgotPasswordState) => {
          state.screenCurrentStage = forgotPasswordStages.INPUT_ID;
          state.loadingConfirm = false;
        }, 'confirmForgotPasswordFail');
        break;
      default:
        showError(error);
        set((state: IForgotPasswordState) => {
          state.loadingConfirm = false;
        }, 'confirmForgotPasswordFailShowError');
    }
  }
};

export default confirmForgotPassword;
