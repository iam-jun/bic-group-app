import _ from 'lodash';
import { ActionTypes } from '~/utils';
import types from './types';

export const authInitState = {
  user: undefined,
  feed: undefined,
  loading: false,
  signingInError: '',
};

function authReducer(
  state = authInitState, action: any = {},
) {
  const { type } = action;
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
    case ActionTypes.RefreshTokenSuccessBein: {
      const user = state?.user as any;
      return _.merge(
        {}, state, {
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
        },
      );
    }
    case ActionTypes.SaveAuthTokens: {
      return _.merge(
        {}, state, {
          feed: {
            accessToken: action.payload.feedAccessToken,
            notiSubscribeToken: action.payload.notiSubscribeToken,
          },
        },
      );
    }
    default:
      return state;
  }
}

export default authReducer;
