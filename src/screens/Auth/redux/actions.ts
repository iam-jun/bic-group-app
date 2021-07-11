import * as actions from './constants';
import {
    ISignUp,
    ISignIn,
    IForgotPassword,
    IForgotPasswordRequest,
    IUser,
} from '~/interfaces/IAuth';

export function signIn(payload: ISignIn) {
    return {
        type: actions.SIGN_IN,
        payload,
    };
}

export function signInOAuth(payload: string) {
    return {
        type: actions.SIGN_IN_OAUTH,
        payload,
    };
}

export function signUp(payload: ISignUp) {
    return {
        type: actions.SIGN_UP,
        payload,
    };
}

export function forgotPassword(payload: IForgotPassword) {
    return {
        type: actions.FORGOT_PASSWORD,
        payload,
    };
}

export function changePassword(payload: IForgotPasswordRequest) {
    return {
        type: actions.CHANGE_PASSWORD,
        payload,
    };
}

export function signOut() {
    return {
        type: actions.SIGN_OUT,
    };
}

export function setUser(payload?: IUser) {
    return {
        type: actions.SET_USER,
        payload,
    };
}

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
