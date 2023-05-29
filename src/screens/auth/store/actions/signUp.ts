import userApi from '~/api/UserApi';
import { IPayloadSignUp } from '~/interfaces/IAuth';
import { IAuthState } from '~/screens/auth/store';

const signUp
  = (set, get) => async (payload: IPayloadSignUp, callbackError: (error: any) => void, callbackSuccess: () => void) => {
    const state: IAuthState = get();
    const { actions: authActions } = state || {};

    try {
      const {
        email, password, userName, fullName, referralCode,
      } = payload;

      authActions.setSignUpLoading(true);
      const params = {
        referralCode,
        user: {
          email,
          password,
          username: userName,
          fullname: fullName,
        },
      };

      const response = await userApi.signUp(params);
      if (response && response?.data) {
        callbackSuccess();
      }
    } catch (error: any) {
      callbackError(error);
    }
  };

export default signUp;
