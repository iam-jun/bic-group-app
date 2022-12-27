import { HubCapsule } from '@aws-amplify/core/src/Hub';
import { Auth } from 'aws-amplify';
import { IObject } from '~/interfaces/common';
import { IUserResponse } from '~/interfaces/IAuth';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import { rootSwitch } from '~/router/stack';
import { IAuthState } from '~/screens/auth/store';
import { getUserFromSharedPreferences, saveUserToSharedPreferences } from '~/services/sharePreferences';
import Store from '~/storeRedux';
import modalActions from '~/storeRedux/modal/actions';
import { timeOut } from '~/utils/common';

const navigation = withNavigation(rootNavigationRef);

const handleAuthEvent = (set, get) => async (data: HubCapsule) => {
  const state: IAuthState = get() || {};
  const { actions: authActions } = state;
  try {
    const { payload: { event } } = data || {};

    if (event === 'signIn') {
      const currentAuthUser = await Auth.currentAuthenticatedUser();
      const { attributes, username, signInUserSession } = currentAuthUser || {};
      Store.store.dispatch(modalActions.showLoading());
      const name = attributes?.name?.length < 50
        ? attributes?.name
        : attributes?.email?.match?.(/^([^@]*)@/)[1];

      const userResponse: IUserResponse = {
        username: username || '',
        signInUserSession: signInUserSession || {},
        attributes: attributes || {},
        name: name || '',
        email: attributes?.email || '',

        id: username,
        role: username,
      };

      const sessionData: IObject<any> = await getUserFromSharedPreferences();
      const activeSessions = sessionData?.activeSessions || {};

      const currentSession = {
        refreshToken: signInUserSession?.refreshToken?.token,
        accessToken: signInUserSession?.accessToken?.jwtToken,
        idToken: signInUserSession?.idToken?.jwtToken,
        expiration: signInUserSession?.idToken?.payload?.exp,
      };

      // saveUserToSharedPreferences
      const payload = {
        currentSession,
        name: userResponse.name,
        email: userResponse.email,
        username: userResponse.username,
        activeSessions: { ...activeSessions, community: new Date().toDateString() },
      };
      await saveUserToSharedPreferences(payload);

      authActions.setAuthUser(userResponse);

      navigation.replace(rootSwitch.mainStack);
      authActions.setSignInLoading(false);
      await timeOut(500);
      Store.store.dispatch(modalActions.hideLoading());
    }
  } catch (e) {
    console.error('\x1b[35m🐣️ handleAuthEvent  ', e, '\x1b[0m');
  }
};

export default handleAuthEvent;
