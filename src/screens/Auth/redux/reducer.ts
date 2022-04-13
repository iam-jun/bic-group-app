import _ from 'lodash';
import {Platform} from 'react-native';
import {forgotPasswordStages} from '~/constants/authConstants';
import {ActionTypes} from '~/utils';
import {setChatAuthenticationInfo} from '~/utils/common';
import types from './types';

export const authInitState = {
  user: undefined,
  feed: undefined,
  loading: false,
  signingInError: '',
  forgotPasswordStage: forgotPasswordStages.INPUT_ID,
  forgotPasswordError: {errBox: '', errRequest: '', errConfirm: ''},
  changePasswordError: {errCurrentPassword: '', errBox: ''},
  changePasswordLoading: false,
};

function authReducer(state = authInitState, action: any = {}) {
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
    case types.SET_CHANGE_PASSWORD_ERROR:
      return {
        ...state,
        changePasswordError: {...action.payload},
      };
    case types.SET_CHANGE_PASSWORD_LOADING:
      return {
        ...state,
        changePasswordLoading: action.payload,
      };
    case ActionTypes.RefreshTokenSuccessBein: {
      const user = state?.user as any;
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
              payload: {
                ...user?.signInUserSession?.idToken?.payload,
                exp: action.payload.idTokenExp,
              },
            },
          },
        },
      });
    }
    case ActionTypes.SaveAuthTokens: {
      if (Platform.OS === 'web') {
        const user = state?.user as any;
        const username = user?.username;
        const exp = user?.signInUserSession?.idToken?.payload?.exp;
        username && exp && setChatAuthenticationInfo(username, exp);
      }
      return _.merge({}, state, {
        feed: {
          accessToken: action.payload.feedAccessToken,
          notiSubscribeToken: action.payload.notiSubscribeToken,
        },
      });
    }
    default:
      return state;
  }
}

export default authReducer;
