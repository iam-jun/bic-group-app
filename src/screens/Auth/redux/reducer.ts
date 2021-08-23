import {ActionTypes} from '~/utils';
import * as types from './types';
import {forgotPasswordStages} from '~/constants/authConstants';
import _ from 'lodash';

export const initAuthState = {
  user: undefined,
  chat: undefined,
  feed: undefined,
  loading: false,
  signingInError: '',
  forgotPasswordStage: forgotPasswordStages.INPUT_ID,
  forgotPasswordError: {errBox: '', errRequest: '', errConfirm: ''},
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
      };
    case types.SET_FORGOT_PASSWORD_LOADING:
      return {
        ...state,
        forgotPasswordLoading: action.payload,
      };
    case types.SET_FORGOT_PASSWORD_STAGE:
      return {
        ...state,
        forgotPasswordStage: action.payload,
      };
    case types.SET_FORGOT_PASSWORD_ERROR:
      return {
        ...state,
        forgotPasswordError: {...action.payload},
      };
    case types.SIGN_OUT:
    case ActionTypes.UnauthorizedLogout:
      return initAuthState;
    case ActionTypes.RefreshTokenSuccessBein:
      return _.merge({}, state, {
        user: {
          signInUserSession: {
            refreshToken: {
              token: action.payload.refreshToken,
            },
            accessToken: {
              jwtToken: action.payload.newToken,
            },
            idToken: {
              jwtToken: action.payload.idToken,
            },
          },
        },
      });
    case ActionTypes.SaveAuthTokens:
      return _.merge({}, state, {
        chat: {
          userId: action.payload.chatUserId,
          accessToken: action.payload.chatAccessToken,
        },
        feed: {
          accessToken: action.payload.feedAccessToken,
          notiSubscribeToken: action.payload.notiSubscribeToken,
        },
      });
    default:
      return state;
  }
}

export default authReducer;
