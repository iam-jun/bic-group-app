import { Auth } from 'aws-amplify';
import i18n from 'i18next';
import { authErrors } from '~/constants/authConstants';
import { ISignIn } from '~/interfaces/IAuth';
import { IAuthState } from '~/screens/auth/store';
import useNotificationStore from '~/screens/Notification/store';
import { initPushTokenMessage } from '~/services/firebase';
import Store from '~/storeRedux';
import modalActions from '~/storeRedux/modal/actions';

const signIn = (set, get) => async (payload: ISignIn) => {
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
    let errorMessage;
    switch (error?.code) {
      case authErrors.NOT_AUTHORIZED_EXCEPTION:
      case authErrors.USER_NOT_FOUND_EXCEPTION:
        errorMessage = i18n.t('auth:text_err_id_password_not_matched');
        break;

      default:
        errorMessage = error?.message || i18n.t('auth:text_err_id_password_not_matched');
    }
    authActions.setSignInLoading(false);
    Store.store.dispatch(modalActions.hideLoading());
    authActions.setSignInError(errorMessage);
  }
};

export default signIn;
