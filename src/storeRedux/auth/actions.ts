import {
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
};
