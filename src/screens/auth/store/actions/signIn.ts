import { Auth } from 'aws-amplify';
import { ISignIn } from '~/interfaces/IAuth';
import { IAuthState } from '~/screens/auth/store';
import useNotificationStore from '~/screens/Notification/store';
import { initPushTokenMessage } from '~/services/firebase';

const signIn = (set, get) => async (payload: ISignIn, callbackError: (error: any)=> void) => {
  const state: IAuthState = get();
  const { actions: authActions } = state || {};

  try {
    authActions.setSignInLoading(true);
    authActions.setSignInError('');

    // make sure to delete push token of older logged in acc in case delete token in AuthStack failed
    const messaging = await initPushTokenMessage();
    await messaging()
      .deleteToken()
      .catch((e: any) => {
        console.error('error when delete push token before log in', e);
        return true;
      });

    useNotificationStore.getState().actions.savePushToken('');
    const { email, password } = payload;

    // handle result in handleAuthEvent
    await Auth.signIn(email, password);
  } catch (error: any) {
    callbackError(error);
  }
};

export default signIn;
