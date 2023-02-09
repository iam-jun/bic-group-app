import groupApi from '~/api/GroupApi';
import { authErrors } from '~/constants/authConstants';
import { IVerifyEmail } from '~/interfaces/IAuth';
import i18n from '~/localization';
import showToastError from '~/store/helper/showToastError';

const resendVerifyEmail = (_set, _get) => async (params: IVerifyEmail) => {
  try {
    await groupApi.resendVerificationEmail(params);
  } catch (error) {
    console.error('\x1b[35m🐣️ resendVerifyEmail  ', error, '\x1b[0m');
    if (error?.code === authErrors.LIMIT_EXCEEDED_EXCEPTION) {
      showToastError({ meta: { message: i18n.t('auth:verify_email_limit_exceeded') } });
    }
  }
};

export default resendVerifyEmail;
