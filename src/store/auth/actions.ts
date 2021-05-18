// flow
import * as actions from './constants';
import {ISignIn, IUser} from './interfaces';

/**
 * Auth Loading
 * @param data
 * @returns {{type: string, payload: boolean}
 */
export function setAuthLoading(payload: boolean) {
  return {
    type: actions.LOADING,
    payload,
  };
}

/**
 * SignIn
 * @param data
 * @returns {{type: string, payload: object}
 */
export function signIn(payload: ISignIn) {
  return {
    type: actions.SIGN_IN,
    payload,
  };
}

/**
 * SignOut
 * @param data
 * @returns {{type: string, payload: object}
 */
export function signOut() {
  return {
    type: actions.SIGN_OUT,
  };
}

/**
 * SignIn Success
 * @returns {{type: string, payload: object}}
 */
export function setUser(payload?: IUser) {
  return {
    type: actions.SET_USER,
    payload,
  };
}

/**
 * Check If user logged in
 * @returns {{type: string }}
 */
export function checkAuthState() {
  return {
    type: actions.CHECK_AUTH_STATE,
  };
}
