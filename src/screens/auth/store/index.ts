import { HubCapsule } from '@aws-amplify/core/src/Hub';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';
import { ISignIn, IUserResponse } from '~/interfaces/IAuth';
import announceSessionExpire from '~/screens/auth/store/actions/announceSessionExpire';
import signOut from '~/screens/auth/store/actions/signOut';
import signIn from './actions/signIn';
import handleAuthEvent from './actions/handleAuthEvent';
import { InitStateType, IBaseState } from '~/store/interfaces/IBaseState';
import { createStore, resetStore } from '~/store/utils';

export interface IAuthState extends IBaseState{
  authUser?: any;
  signIn: {
    loading: boolean,
    error: string,
  },
  signingOut: boolean;
  showingNoticeSession: boolean;

  actions: {
    setAuthUser: (user: IUserResponse) => void;
    setSignInError: (error: string) => void;
    setSignInLoading: (loading: boolean) => void;
    setSigningOut: (signingOut: boolean) => void;
    setRefreshedToken: (data: any) => void;

    signIn: (payload: ISignIn, callbackError?: (error: any)=> void) => void;
    signOut: () => void;
    handleAuthEvent: (data: HubCapsule) => void;
    announceSessionExpire: () => void;
  }
}

const initialState: InitStateType<IAuthState> = {
  authUser: undefined,
  signIn: {
    loading: false,
    error: '',
  },
  signingOut: false,
  showingNoticeSession: false,
};

const authController = (set, get) => ({
  ...initialState,

  actions: {
    setAuthUser: (user: IUserResponse) => {
      set((state: IAuthState) => {
        state.authUser = user;
      }, 'setAuthUser');
    },
    setSignInError: (error) => {
      set((state: IAuthState) => {
        state.signIn.error = error || '';
      }, 'setSignInError');
    },
    setSignInLoading: (loading) => {
      set((state: IAuthState) => {
        state.signIn.loading = loading;
      }, 'setSignInLoading');
    },
    setSigningOut: (signingOut) => {
      set((state: IAuthState) => {
        state.signingOut = signingOut;
      }, 'setSignInLoading');
    },
    setRefreshedToken: (data: any) => {
      const {
        newToken, refreshToken, idToken, exp,
      } = data || {};
      set((state: IAuthState) => {
        state.authUser.signInUserSession.refreshToken.token = newToken;
        state.authUser.signInUserSession.accessToken.jwtToken = refreshToken;
        state.authUser.signInUserSession.idToken.jwtToken = idToken;
        state.authUser.signInUserSession.idToken.payload.exp = exp;
      }, 'setRefreshedToken');
    },

    signIn: signIn(set, get),
    signOut: signOut(set, get),
    handleAuthEvent: handleAuthEvent(set, get),
    announceSessionExpire: announceSessionExpire(set, get),
  },

  reset: () => resetStore(initialState, set),
});

const useAuthController = createStore<IAuthState>(authController, {
  persist: {
    name: 'AuthStorage',
    storage: createJSONStorage(() => AsyncStorage),
    partialize: (state) => ({ authUser: state.authUser }),
  },
});

export default useAuthController;
