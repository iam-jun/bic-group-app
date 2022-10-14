import Store from '~/storeRedux';
import groupApi from '~/api/GroupApi';
import { IToastMessage } from '~/interfaces/common';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import showError from '~/store/helper/showError';
import IPermissionSchemeState from '../Interface';
import modalActions from '~/storeRedux/modal/actions';
import { IScheme } from '~/interfaces/IGroup';

const navigation = withNavigation(rootNavigationRef);

const createGeneralScheme = (set, get) => async (communityId: string) => {
  try {
    set((state: IPermissionSchemeState) => {
      state.creatingScheme.creating = true;
    }, 'createGeneralScheme');

    const permissionSchemeData: IPermissionSchemeState = get();
    const schemeData = permissionSchemeData.creatingScheme?.data || {} as IScheme;

    const response = await groupApi.createGeneralScheme(communityId, schemeData);

    if (response?.data) {
      navigation.goBack();
      set((state: IPermissionSchemeState) => {
        state.creatingScheme.creating = false;
        state.generalScheme.data = response.data;
      }, 'createGeneralSchemeSuccess');

      const toastMessage: IToastMessage = {
        content: 'communities:permission:text_create_scheme_success',
      };
      Store.store.dispatch(modalActions.showHideToastMessage(toastMessage));
    } else {
      set((state: IPermissionSchemeState) => {
        state.creatingScheme.creating = false;
      }, 'createGeneralSchemeFailure');
    }
  } catch (error) {
    console.error('createGeneralScheme error:', error);

    set((state: IPermissionSchemeState) => {
      state.creatingScheme.creating = false;
    }, 'createGeneralSchemeError');

    showError(error);
  }
};

export default createGeneralScheme;
