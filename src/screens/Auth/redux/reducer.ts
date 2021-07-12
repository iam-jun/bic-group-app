import * as types from './types';
import {forgotPasswordStages} from "~/constants/authConstants";

export const initAuthState = {
    user: null,
    loading: false,
    signingInError: '',
    forgotPasswordStage: forgotPasswordStages.INPUT_ID,
    forgotPasswordError: { errBox: '', errRequest: '', errConfirm: '' },
};

function authReducer(state = initAuthState, action: any = {}) {
    const {type} = action;
    switch (type) {
        case types.SET_USER:
            return {
                ...state,
                user: action.payload,
                loading: false,
            };
        case types.SET_LOADING:
            return {
                ...state,
                loading: action.payload,
            };
        case types.SET_SIGNING_IN_ERROR:
            return {
                ...state,
                signingInError: action.payload,
            }
        case types.SET_FORGOT_PASSWORD_LOADING:
            return {
                ...state,
                forgotPasswordLoading: action.payload,
            }
        case types.SET_FORGOT_PASSWORD_STAGE:
            return {
                ...state,
                forgotPasswordStage: action.payload,
            }
        case types.SET_FORGOT_PASSWORD_ERROR:
            return {
                ...state,
                forgotPasswordError: { ...action.payload },
            }
        default:
            return state;
    }
}

export default authReducer;
