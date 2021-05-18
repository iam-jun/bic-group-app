import {put, takeLatest} from 'redux-saga/effects';
import {rootSwitch} from '~/configs/navigator';
import * as types from './constants';
import * as actions from './actions';
import * as IAuth from './interfaces';
import * as refNavigator from '~/utils/refNavigator';
import * as storage from '~/asyncStorage';

export default function* authSaga() {
  yield takeLatest(types.SIGN_IN, signIn);
  yield takeLatest(types.SIGN_OUT, signOut);
  yield takeLatest(types.CHECK_AUTH_STATE, checkAuthState);
}

/**
 * SignIn
 * @param payload
 * @returns {IterableIterator<*>}
 */

function* signIn({payload}: {type: string; payload: IAuth.ISignIn}) {
  try {
    yield storage.setUser(payload);
    refNavigator.replace(rootSwitch.mainStack);
  } catch (e) {
    console.error(e);
  } finally {
  }
}

function* signOut() {
  yield storage.removeUser();
  refNavigator.replace(rootSwitch.authStack);
}

function* checkAuthState() {
  try {
    const user: IAuth.ISignIn = yield storage.getUser();
    if (user) yield put(actions.signIn(user));
  } catch (e) {
    console.error(e);
  }
}
