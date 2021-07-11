import * as types from './types';

export const initAuthState = {
    user: null,
    loading: false,
    signingInError: '',
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
        default:
            return state;
    }
}

export default authReducer;
