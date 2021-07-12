import * as types from './types';
import {
    ISignUp,
    ISignIn,
    IForgotPasswordConfirm,
    IUser, IUserResponse, IForgotPasswordError,
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

export function setForgotPasswordLoading(payload: boolean) {
    return {
        type: types.SET_FORGOT_PASSWORD_LOADING,
        payload,
    }
}

export function setForgotPasswordStage(payload: string) {
    return {
        type: types.SET_FORGOT_PASSWORD_STAGE,
        payload,
    }
}

export function setForgotPasswordError(payload: IForgotPasswordError) {
    return {
        type: types.SET_FORGOT_PASSWORD_ERROR,
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

export function checkAuthState() {
    return {
        type: types.CHECK_AUTH_STATE,
    };
}
