import {put, takeLatest} from 'redux-saga/effects';
import {Auth} from 'aws-amplify';

import {rootSwitch, authStack} from '~/configs/navigator';
import * as types from './constants';
import * as IAuth from './interfaces';
import * as refNavigator from '~/utils/refNavigator';
import * as storage from '~/asyncStorage';
import * as actions from './actions';
import * as actionsCommon from '../common/actions';
import {ERROR} from '~/constants/common';
import {convertMultiLanguage} from '~/utils/language';

export default function* authSaga() {
  yield takeLatest(types.SIGN_IN, signIn);
  yield takeLatest(types.SIGN_UP, signUp);
  // yield takeLatest(types.SIGN_IN_OAUTH, signInOAuth);
  yield takeLatest(types.FORGOT_PASSWORD, forgotPassword);
  yield takeLatest(types.CHANGE_PASSWORD, forgotPasswordSubmit);
  yield takeLatest(types.SIGN_OUT, signOut);
  // yield takeLatest(types.CHECK_AUTH_STATE, checkAuthState);
}

const languages = convertMultiLanguage();

/**
 * SignIn
 * @param payload
 * @returns {IterableIterator<*>}
 */

function* signIn({payload}: {type: string; payload: IAuth.ISignIn}) {
  try {
    const {email, password} = payload;
    const user: IAuth.IUser = yield Auth.signIn(email, password);
    yield storage.setUser(user);
    yield put(actions.setUser(user));
    refNavigator.replace(rootSwitch.mainStack);
  } catch (err) {
    yield put(actionsCommon.showAlert({title: ERROR, content: err.message}));
  }
}

// function* signInOAuth({payload}: {type: string; payload: string}) {
//   try {
//     const user: CognitoUser = yield federatedSignIn(payload);
//   } catch (e) {
//     console.log(e);
//   }
// }

function* signUp({payload}: {type: string; payload: IAuth.ISignUp}) {
  const {username, email, password} = payload;
  try {
    const response: IAuth.ISignUpResponse = yield Auth.signUp({
      username: email,
      password,
      attributes: {
        email,
        name: username,
      },
    });
    if (response)
      yield put(
        actionsCommon.showAlert({
          title: languages.auth.text_title_success,
          content: languages.auth.text_sign_up_success,
          onConfirm: () => refNavigator.navigate(authStack.login),
        }),
      );
  } catch (err) {
    yield put(actionsCommon.showAlert({title: ERROR, content: err.message}));
  }
}

function* forgotPassword({
  payload,
}: {
  type: string;
  payload: IAuth.IForgotPassword;
}) {
  const {email, callback} = payload;
  try {
    yield Auth.forgotPassword(email);
    callback();
  } catch (err) {
    yield put(actionsCommon.showAlert({title: ERROR, content: err.message}));
  }
}

function* forgotPasswordSubmit({
  payload,
}: {
  type: string;
  payload: IAuth.IForgotPasswordRequest;
}) {
  const {code, email, password} = payload;
  try {
    yield Auth.forgotPasswordSubmit(email, code, password);
    yield put(
      actionsCommon.showAlert({
        title: languages.auth.text_title_success,
        content: languages.auth.text_change_password_success,
        onConfirm: () => {
          refNavigator.navigate(authStack.login);
        },
      }),
    );
  } catch (err) {
    yield put(actionsCommon.showAlert({title: ERROR, content: err.message}));
  }
}

function* signOut() {
  try {
    yield storage.removeUser();
    yield Auth.signOut();
    refNavigator.replace(rootSwitch.authStack);
  } catch (err) {
    yield put(actionsCommon.showAlert({title: ERROR, content: err.message}));
  }
}

// function* checkAuthState() {
// try {
//   const user: IAuth.ISignIn = yield storage.getUser();
//   if (user) yield put(actions.signIn(user));
// } catch (e) {
//   console.error(e);
// }
// }

// function* federatedSignIn(payload: any) {
//   yield Auth.federatedSignIn({provider: payload});
// }
