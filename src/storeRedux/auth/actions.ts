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
import types from './types';

export default {
  setUser: (payload?: IUser) => ({
    type: types.SET_USER,
    payload,
  }),

  setLoading: (payload: boolean) => ({
    type: types.SET_LOADING,
    payload,
  }),

  setSigningInError: (payload: string) => ({
    type: types.SET_SIGNING_IN_ERROR,
    payload,
  }),
  setForgotPasswordLoading: (payload: boolean) => ({
    type: types.SET_FORGOT_PASSWORD_LOADING,
    payload,
  }),

  setForgotPasswordStage: (payload: string) => ({
    type: types.SET_FORGOT_PASSWORD_STAGE,
    payload,
  }),

  setForgotPasswordError: (payload: IForgotPasswordError) => ({
    type: types.SET_FORGOT_PASSWORD_ERROR,
    payload,
  }),

  setChangePasswordLoading: (payload: boolean) => ({
    type: types.SET_CHANGE_PASSWORD_LOADING,
    payload,
  }),

  setChangePasswordError: (payload: IChangePasswordError) => ({
    type: types.SET_CHANGE_PASSWORD_ERROR,
    payload,
  }),

  signIn: (payload: ISignIn) => ({
    type: types.SIGN_IN,
    payload,
  }),

  signInSuccess: (payload: IUserResponse) => ({
    type: types.SIGN_IN_SUCCESS,
    payload,
  }),

  signUp: (payload: ISignUp) => ({
    type: types.SIGN_UP,
    payload,
  }),

  signOut: (shouldNavigate = true) => ({
    type: types.SIGN_OUT,
    payload: shouldNavigate,
  }),

  forgotPasswordRequest: (payload: string) => ({
    type: types.FORGOT_PASSWORD_REQUEST,
    payload,
  }),

  forgotPasswordConfirm: (payload: IForgotPasswordConfirm) => ({
    type: types.FORGOT_PASSWORD_CONFIRM,
    payload,
  }),

  changePassword: (payload: IChangePasswordPayload) => ({
    type: types.CHANGE_PASSWORD,
    payload,
  }),
};
