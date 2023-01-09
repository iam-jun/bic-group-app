import { IAuthState } from '~/screens/auth/store/index';

export const getUser = (state: IAuthState) => state?.authUser;
export const getAuthToken = (state: IAuthState) => state?.authUser?.signInUserSession?.idToken?.jwtToken;
export const getTokenExpiration = (state: IAuthState) => state?.authUser?.signInUserSession?.idToken?.payload?.exp;
export const getUserId = (state: IAuthState) => state?.authUser?.id;
