import * as types from './types';
import {
    ISignUp,
    ISignIn,
    IForgotPassword,
    IForgotPasswordRequest,
    IUser, IUserResponse,
} from '~/interfaces/IAuth';

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
    }
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

export function forgotPassword(payload: IForgotPassword) {
    return {
        type: types.FORGOT_PASSWORD,
        payload,
    };
}

export function changePassword(payload: IForgotPasswordRequest) {
    return {
        type: types.CHANGE_PASSWORD,
        payload,
    };
}


export function checkAuthState() {
    return {
        type: types.CHECK_AUTH_STATE,
    };
}
