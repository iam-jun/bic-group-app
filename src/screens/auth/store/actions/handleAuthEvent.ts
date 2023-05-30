import { HubCapsule } from '@aws-amplify/core/src/Hub';
import { Auth } from 'aws-amplify';
import { makeHttpRequest } from '~/api/apiRequest';
import { groupsApiConfig } from '~/api/GroupApi';
import { IObject } from '~/interfaces/common';
import { IUserResponse } from '~/interfaces/IAuth';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import { rootSwitch } from '~/router/stack';
import { IAuthState } from '~/screens/auth/store';
import useCommonController from '~/screens/store';
import mixPanelManager from '~/services/mixpanel';
import { getUserFromSharedPreferences, saveUserToSharedPreferences } from '~/services/sharePreferences';
import useModalStore from '~/store/modal';
import { mapProfile } from '~/helpers/common';
import { timeOut } from '~/utils/common';

const navigation = withNavigation(rootNavigationRef);

const getUserProfile = async (username, token) => {
  try {
    const requestConfig = groupsApiConfig.getUserProfile(username, { type: 'username' });
    requestConfig.headers = { ...requestConfig.headers, Authorization: token };
    const response = await makeHttpRequest(requestConfig);
    return response?.data?.data || {};
  } catch (error) {
    console.error('\x1b[35m🐣️ handleAuthEvent getUserId error:', error, '\x1b[0m');
    return {};
  }
};

const handleAuthEvent = (set, get) => async (data: HubCapsule) => {
  const state: IAuthState = get() || {};
  const { actions: authActions } = state;
  try {
    const { payload: { event } } = data || {};

    if (event === 'signIn') {
      const currentAuthUser = await Auth.currentAuthenticatedUser();
      const { attributes, username, signInUserSession } = currentAuthUser || {};
      useModalStore.getState().actions.setLoadingModal(true);
      const name = attributes?.name?.length < 50
        ? attributes?.name
        : attributes?.email?.match?.(/^([^@]*)@/)[1];

      const userProfile = await getUserProfile(username, signInUserSession?.idToken?.jwtToken);
      useCommonController.getState().actions.setMyProfile(mapProfile(userProfile));

      const userResponse: IUserResponse = {
        username: username || '',
        signInUserSession: signInUserSession || {},
        attributes: attributes || {},
        name: name || '',
        email: attributes?.email || '',

        userId: userProfile?.id,
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
        ...sessionData,
        currentSession,
        name: userResponse.name,
        email: userResponse.email,
        username: userResponse.username,
        activeSessions: { ...activeSessions, community: new Date().toDateString() },
      };
      await saveUserToSharedPreferences(payload);

      authActions.setAuthUser(userResponse);

      mixPanelManager.updateUser(userResponse.email);

      navigation.replace(rootSwitch.mainStack);
      authActions.setSignInLoading(false);
      await timeOut(500);
      useModalStore.getState().actions.setLoadingModal(false);
    }
  } catch (e) {
    console.error('\x1b[35m🐣️ handleAuthEvent  ', e, '\x1b[0m');
  }
};

export default handleAuthEvent;
