import { Auth } from 'aws-amplify';
import { IObject, IToastMessage } from '~/interfaces/common';
import { IChangePasswordPayload } from '~/interfaces/IAuth';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import { IChangePasswordState } from '..';
import Store from '~/storeRedux';
import modalActions from '~/storeRedux/modal/actions';
import { authErrors } from '~/constants/authConstants';
import i18n from '~/localization';
import showError from '~/store/helper/showError';

const navigation = withNavigation(rootNavigationRef);

const changePassword = (set, _get) => async (payload: IChangePasswordPayload) => {
  try {
    set((state: IChangePasswordState) => {
      state.errorText = '';
      state.loading = true;
    }, 'changePassword');

    const { oldPassword, newPassword, global } = payload;
    const user: IObject<any> = await Auth.currentAuthenticatedUser();
    const data: string = await Auth.changePassword(
      user,
      oldPassword,
      newPassword,
    );
    if (data === 'SUCCESS' && global) {
      await Auth.signOut({ global });
    }

    navigation.goBack();
    const toastMessage: IToastMessage = { content: 'auth:text_change_password_success_desc' };
    Store.store.dispatch(modalActions.showHideToastMessage(toastMessage));
    set((state: IChangePasswordState) => {
      state.errorText = '';
      state.loading = false;
    }, 'changePasswordSuccess');
  } catch (error) {
    console.error('changePassword error:', error);
    let errCurrentPassword = '';
    switch (error.code) {
      case authErrors.NOT_AUTHORIZED_EXCEPTION:
        errCurrentPassword = i18n.t('auth:text_err_wrong_current_password');
        break;
      case authErrors.LIMIT_EXCEEDED_EXCEPTION:
        showError({ message: i18n.t('auth:text_err_limit_exceeded') });
        break;
      default:
        showError(error);
    }
    set((state: IChangePasswordState) => {
      state.errorText = errCurrentPassword;
      state.loading = false;
    }, 'changePasswordFail');
  }
};

export default changePassword;
