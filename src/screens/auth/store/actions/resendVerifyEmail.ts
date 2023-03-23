import groupApi from '~/api/GroupApi';
import { IVerifyEmail } from '~/interfaces/IAuth';

const resendVerifyEmail
  = () => async (payload: IVerifyEmail, callbackError: (error: any) => void, callbackSuccess: () => void) => {
    try {
      const newParams = { ...payload, email: encodeURIComponent(payload.email) } as IVerifyEmail;
      const response = await groupApi.resendVerificationEmail(newParams);
      if (response && response?.data) {
        callbackSuccess();
      }
    } catch (error) {
      console.error('\x1b[35m🐣️ resendVerifyEmail  ', error, '\x1b[0m');
      callbackError(error);
    }
  };

export default resendVerifyEmail;
