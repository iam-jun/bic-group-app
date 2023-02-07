import groupApi from '~/api/GroupApi';
import { IToastMessage } from '~/interfaces/common';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import showToastError from '~/store/helper/showToastError';
import IPermissionSchemeState from '../Interface';
import { IScheme } from '~/interfaces/IGroup';
import showToast from '~/store/helper/showToast';

const navigation = withNavigation(rootNavigationRef);

const updateGroupScheme = (set, get) => async (
  { communityId, schemeId }: {communityId: string; schemeId: string},
) => {
  try {
    set((state: IPermissionSchemeState) => {
      state.creatingScheme.creating = true;
    }, 'updateGroupScheme');

    const permissionSchemeData: IPermissionSchemeState = get();
    const schemeData = permissionSchemeData.creatingScheme?.data || {} as IScheme;
    const { getSchemes } = permissionSchemeData.actions;

    const response = await groupApi.updateGroupScheme(
      communityId,
      schemeId,
      schemeData,
    );

    set((state: IPermissionSchemeState) => {
      state.creatingScheme.creating = false;
    }, 'updateGroupSchemeSuccess');

    if (response?.data) {
      // reload schemes when updating successfully
      getSchemes({ communityId, isRefreshing: true });
      navigation.goBack();
      const toastMessage: IToastMessage = {
        content: 'communities:permission:text_update_scheme_success',
      };
      showToast(toastMessage);
    }
  } catch (error) {
    console.error('updateGroupScheme error:', error);

    set((state: IPermissionSchemeState) => {
      state.creatingScheme.creating = false;
    }, 'updateGroupSchemeError');

    showToastError(error);
  }
};

export default updateGroupScheme;
