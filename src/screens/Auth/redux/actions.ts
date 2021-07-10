// flow
import * as actions from './constants';
import {
  ISignUp,
  ISignIn,
  IForgotPassword,
  IForgotPasswordRequest,
  IUser,
} from '../../../interfaces/IAuth';

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
 * signInOAuth
 * @param data
 * @returns {{type: string, payload: string}
 */

export function signInOAuth(payload: string) {
  return {
    type: actions.SIGN_IN_OAUTH,
    payload,
  };
}

/**
 * signUp
 * @param data
 * @returns {{type: string, payload: object}
 */

export function signUp(payload: ISignUp) {
  return {
    type: actions.SIGN_UP,
    payload,
  };
}

/**
 * forgotPassword
 * @param data
 * @returns {{type: string, payload: object}
 */

export function forgotPassword(payload: IForgotPassword) {
  return {
    type: actions.FORGOT_PASSWORD,
    payload,
  };
}

/**
 * forgotPassword
 * @param data
 * @returns {{type: string, payload: object}
 */

export function changePassword(payload: IForgotPasswordRequest) {
  return {
    type: actions.CHANGE_PASSWORD,
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

export function setLoading(payload: boolean) {
  return {
    type: actions.SET_LOADING,
    payload,
  };
}
