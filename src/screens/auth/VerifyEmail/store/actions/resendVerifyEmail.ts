import groupApi from '~/api/GroupApi';
import { authErrors } from '~/constants/authConstants';
import { IVerifyEmail } from '~/interfaces/IAuth';
import i18n from '~/localization';
import showToastError from '~/store/helper/showToastError';
import { IVerifyEmailState } from '..';
import useModalStore from '~/store/modal';

const resendVerifyEmail = (_set, get) => async (
  params: IVerifyEmail,
) => {
  const state: IVerifyEmailState = get();
  const { actions } = state || {};
  try {
    const newParams = { ...params, email: encodeURIComponent(params.email) } as IVerifyEmail;
    await groupApi.resendVerificationEmail(newParams);
    actions.setSentVerifyEmail(true);
  } catch (error) {
    console.error('\x1b[35m🐣️ resendVerifyEmail  ', error, '\x1b[0m');
    if (error?.code === authErrors.LIMIT_EXCEEDED_EXCEPTION) {
      useModalStore.getState().actions.hideModal();
      showToastError({ meta: { message: i18n.t('auth:verify_email_limit_exceeded') } });
    } else {
      actions.setSentVerifyEmail(true);
    }
  }
};

export default resendVerifyEmail;
