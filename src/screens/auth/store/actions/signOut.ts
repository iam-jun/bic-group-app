import { Auth } from 'aws-amplify';
import { makeRemovePushTokenRequest } from '~/api/apiRequest';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import { rootSwitch } from '~/router/stack';
import { IAuthState } from '~/screens/auth/store';
import FileUploader from '~/services/fileUploader';
import { deleteTokenMessage } from '~/services/firebase';
import ImageUploader from '~/services/imageUploader';
import { clearAllSharedPreferences } from '~/services/sharePreferences';
import showToastError from '~/store/helper/showToastError';
import resetAllStores from '~/store/resetAllStores';
import Store from '~/storeRedux';
import modalActions from '~/storeRedux/modal/actions';

const navigation = withNavigation(rootNavigationRef);

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
    Store.store.dispatch(modalActions.showLoading());

    await Auth.signOut();

    await clearAllSharedPreferences();

    await removePushToken();

    removePersistData();
    resetUploader();

    resetAllStores();
    resetAuthStore();

    Store.store.dispatch(modalActions.hideLoading());

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
  FileUploader.getInstance()?.resetData?.();
  ImageUploader.getInstance()?.resetData?.();
};

const removePushToken = async () => {
  makeRemovePushTokenRequest();
  await deleteTokenMessage();
};

const removePersistData = () => {
  // todo check to remove persist data later
};

export default signOut;
