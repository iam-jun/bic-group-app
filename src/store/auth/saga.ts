import {put, takeLatest} from 'redux-saga/effects';
import {rootSwitch} from '~/configs/navigator';
import * as types from './constants';
import * as IAuth from './interfaces';
import * as refNavigator from '~/utils/refNavigator';
import * as storage from '~/asyncStorage';
import * as actions from './actions';
import {Auth} from 'aws-amplify';
import {ISignUpResult} from 'amazon-cognito-identity-js';

export default function* authSaga() {
  yield takeLatest(types.SIGN_IN, signIn);
  yield takeLatest(types.SIGN_UP, signUp);
  // yield takeLatest(types.SIGN_IN_OAUTH, signInOAuth);
  yield takeLatest(types.FORGOT_PASSWORD, forgotPassword);
  yield takeLatest(types.CHANGE_PASSWORD, forgotPasswordSubmit);
  yield takeLatest(types.SIGN_OUT, signOut);
  // yield takeLatest(types.CHECK_AUTH_STATE, checkAuthState);
}

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
    console.error(err);
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
  const {username, email, password, callback} = payload;
  try {
    const response: ISignUpResult = yield Auth.signUp({
      username: email,
      password,
      attributes: {
        email,
        name: username,
      },
    });
    callback(response);
  } catch (err) {
    console.log(err);
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
    console.log(err);
  }
}

function* forgotPasswordSubmit({
  payload,
}: {
  type: string;
  payload: IAuth.IForgotPasswordSubmit;
}) {
  const {code, email, password, submitPasswordCb} = payload;
  try {
    yield Auth.forgotPasswordSubmit(email, code, password);
    submitPasswordCb();
  } catch (err) {
    console.log(err);
  }
}

function* signOut() {
  try {
    yield storage.removeUser();
    yield Auth.signOut();
    refNavigator.replace(rootSwitch.authStack);
  } catch (err) {
    console.log(err);
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
