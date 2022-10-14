import Store from '~/storeRedux';
import groupApi from '~/api/GroupApi';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import { sortFixedRoles } from '~/screens/groups/helper';
import showError from '~/store/helper/showError';
import IPermissionSchemeState from '../Interface';
import modalActions from '~/storeRedux/modal/actions';
import { IToastMessage } from '~/interfaces/common';
import { IScheme } from '~/interfaces/IGroup';

const navigation = withNavigation(rootNavigationRef);

const updateGeneralScheme = (set, get) => async (communityId: string) => {
  try {
    set((state: IPermissionSchemeState) => {
      state.creatingScheme.creating = true;
    }, 'updateGeneralScheme');

    const permissionSchemeData: IPermissionSchemeState = get();
    const schemeData = permissionSchemeData.creatingScheme?.data || {} as IScheme;

    const response = await groupApi.updateGeneralScheme(communityId, schemeData);

    set((state: IPermissionSchemeState) => {
      state.creatingScheme.creating = false;
    }, 'updateGeneralSchemeSuccess');

    const dataWithOrderedFixRole = sortFixedRoles(response.data);
    navigation.goBack();
    set((state: IPermissionSchemeState) => {
      state.generalScheme.data = dataWithOrderedFixRole;
    });

    const toastMessage: IToastMessage = {
      content: 'communities:permission:text_update_scheme_success',
    };
    Store.store.dispatch(modalActions.showHideToastMessage(toastMessage));
  } catch (error) {
    console.error('updateGeneralScheme error:', error);

    set((state: IPermissionSchemeState) => {
      state.creatingScheme.creating = false;
    }, 'updateGeneralSchemeError');

    showError(error);
  }
};

export default updateGeneralScheme;
