import { Auth } from 'aws-amplify';
import { Platform } from 'react-native';
import { makeRemovePushTokenRequest } from '~/api/apiRequest';
import { IObject } from '~/interfaces/common';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import { rootSwitch } from '~/router/stack';
import { IAuthState } from '~/screens/auth/store';
import { deleteTokenMessage } from '~/services/firebase';
import { getUserFromSharedPreferences, isAppInstalled, saveUserToSharedPreferences } from '~/services/sharePreferences';
import showToastError from '~/store/helper/showToastError';
import useModalStore from '~/store/modal';
import resetAllStores from '~/store/resetAllStores';
import useUploaderStore from '~/store/uploader';

const navigation = withNavigation(rootNavigationRef);

const updateSharedPreferences = async () => {
  /**
  * For android, we stored authentication in separated DB.
  * So only remove its own session
  */
  if (Platform.OS === 'android') {
    await saveUserToSharedPreferences(null);
    return;
  }

  const sessionData: IObject<any> = await getUserFromSharedPreferences();
  const isInstalled = await isAppInstalled();
  const activeSessions = sessionData?.activeSessions || {};

  /**
   * if BIC chat is installed and has active session
   *  just only remove chat session
   */
  if (isInstalled && activeSessions.chat) {
    delete activeSessions?.community;
    const data = {
      ...sessionData,
      activeSessions,

    };

    await saveUserToSharedPreferences(data);
  } else {
    // clear all session
    await saveUserToSharedPreferences(null);
  }
};

const signOut = (set, get) => async () => {
  const authState: IAuthState = get() || {};
  const { signingOut, actions: authActions, reset: resetAuthStore } = authState;

  try {
    if (signingOut) {
      // eslint-disable-next-line no-console
      console.log('\x1b[36m🐣️ signing out...\x1b[0m');
      return;
    }

    authActions.setSigningOut(true);
    useModalStore.getState().actions.setLoadingModal(true);

    await Auth.signOut();

    await updateSharedPreferences();

    await removePushToken();

    removePersistData();
    resetUploader();

    resetAllStores();
    resetAuthStore();

    useModalStore.getState().actions.setLoadingModal(false);

    navigation.replace(rootSwitch.authStack);
  } catch (err) {
    console.error('\x1b[35m🐣️ signOut error: ', err, '\x1b[0m');
    showToastError(err);
    resetAllStores();
    resetAuthStore();
    navigation.replace(rootSwitch.authStack);
  }
};

const resetUploader = () => {
  useUploaderStore.getState().reset();
};

const removePushToken = async () => {
  makeRemovePushTokenRequest();
  await deleteTokenMessage();
};

const removePersistData = () => {
  // todo check to remove persist data later
};

export default signOut;
