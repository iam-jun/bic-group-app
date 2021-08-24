import {
  IChangePasswordError,
  IChangePasswordPayload,
  IForgotPasswordConfirm,
  IForgotPasswordError,
  ISignIn,
  ISignUp,
  IUser,
  IUserResponse,
} from '~/interfaces/IAuth';
import * as types from './types';

export function setUser(payload?: IUser) {
  return {
    type: types.SET_USER,
    payload,
  };
}

export function setLoading(payload: boolean) {
  return {
    type: types.SET_LOADING,
    payload,
  };
}

export function setSigningInError(payload: string) {
  return {
    type: types.SET_SIGNING_IN_ERROR,
    payload,
  };
}

export function setForgotPasswordLoading(payload: boolean) {
  return {
    type: types.SET_FORGOT_PASSWORD_LOADING,
    payload,
  };
}

export function setForgotPasswordStage(payload: string) {
  return {
    type: types.SET_FORGOT_PASSWORD_STAGE,
    payload,
  };
}

export function setForgotPasswordError(payload: IForgotPasswordError) {
  return {
    type: types.SET_FORGOT_PASSWORD_ERROR,
    payload,
  };
}

export function setChangePasswordLoading(payload: boolean) {
  return {
    type: types.SET_CHANGE_PASSWORD_ERROR,
    payload,
  };
}

export function setChangePasswordError(payload: IChangePasswordError) {
  return {
    type: types.SET_CHANGE_PASSWORD_ERROR,
    payload,
  };
}

export function signIn(payload: ISignIn) {
  return {
    type: types.SIGN_IN,
    payload,
  };
}

export function signInOAuth(payload: string) {
  return {
    type: types.SIGN_IN_OAUTH,
    payload,
  };
}

export function signInSuccess(payload: IUserResponse) {
  return {
    type: types.SIGN_IN_SUCCESS,
    payload,
  };
}

export function signUp(payload: ISignUp) {
  return {
    type: types.SIGN_UP,
    payload,
  };
}

export function signOut() {
  return {
    type: types.SIGN_OUT,
  };
}

export function forgotPasswordRequest(payload: string) {
  return {
    type: types.FORGOT_PASSWORD_REQUEST,
    payload,
  };
}

export function forgotPasswordConfirm(payload: IForgotPasswordConfirm) {
  return {
    type: types.FORGOT_PASSWORD_CONFIRM,
    payload,
  };
}

export function changePassword(payload: IChangePasswordPayload) {
  return {
    type: types.CHANGE_PASSWORD,
    payload,
  };
}
