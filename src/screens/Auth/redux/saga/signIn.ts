import {Auth} from 'aws-amplify';
import i18n from 'i18next';
import {put} from 'redux-saga/effects';
import {authErrors} from '~/constants/authConstants';
import * as IAuth from '~/interfaces/IAuth';
import notificationsActions from '~/screens/Notification/redux/actions';
import modalActions from '~/store/modal/actions';
import actions from '../actions';
import {initPushTokenMessage} from '~/services/firebase';

export default function* signIn({
  payload,
}: {
  type: string;
  payload: IAuth.ISignIn;
}): any {
  try {
    yield put(actions.setLoading(true));
    yield put(actions.setSigningInError(''));
    // make sure to delete push token of older logged in acc in case delete token in AuthStack failed
    const messaging = yield initPushTokenMessage();
    yield messaging()
      .deleteToken()
      .catch((e: any) => {
        console.log('error when delete push token before log in', e);
        return true;
      });
    yield put(notificationsActions.savePushToken(''));
    const {email, password} = payload;
    //handle result in useAuthHub
    yield Auth.signIn(email, password);
  } catch (error: any) {
    let errorMessage;
    switch (error?.code) {
      case authErrors.NOT_AUTHORIZED_EXCEPTION:
        errorMessage = i18n.t('auth:text_err_id_password_not_matched');
        break;
      default:
        errorMessage =
          error?.message || i18n.t('auth:text_err_id_password_not_matched');
    }
    yield onSignInFailed(errorMessage);
  }
}

function* onSignInFailed(errorMessage: string) {
  yield put(modalActions.hideLoading());
  yield put(actions.setLoading(false));
  yield put(actions.setSigningInError(errorMessage));
}
