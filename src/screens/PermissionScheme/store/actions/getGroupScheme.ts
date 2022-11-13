import { cloneDeep } from 'lodash';
import groupApi from '~/api/GroupApi';
import APIErrorCode from '~/constants/apiErrorCode';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import { sortFixedRoles } from '~/screens/groups/helper';
import showError from '~/store/helper/showError';
import { getMemberRoleIndex } from '../../CreatePermissionScheme/helper';
import IPermissionSchemeState from '../Interface';

const navigation = withNavigation(rootNavigationRef);

const getGroupScheme = (set, get) => async ({ communityId, schemeId }: {communityId: string; schemeId: string}) => {
  const permissionSchemeData: IPermissionSchemeState = get();
  const { actions } = permissionSchemeData;
  try {
    const response = await groupApi.getGroupScheme(communityId, schemeId);

    const dataWithOrderedFixRole = sortFixedRoles(response.data);

    // storing this data for comparing original group scheme and editing scheme
    set((state: IPermissionSchemeState) => {
      state.groupScheme.data = cloneDeep(dataWithOrderedFixRole);
    }, 'getGroupSchemeSuccess');

    // provide full groupScheme detail for updating group scheme
    const memberRoleIndex = getMemberRoleIndex(dataWithOrderedFixRole);
    actions.setCreatingScheme({
      data: cloneDeep(dataWithOrderedFixRole),
      memberRoleIndex,
    });
  } catch (error) {
    console.error('getGroupScheme error:', error);

    if (error?.code === APIErrorCode.Group.SCHEME_NOT_FOUND) {
      actions.getSchemes({ communityId, isRefreshing: true });
      navigation.goBack();
    }

    showError(error);
  }
};

export default getGroupScheme;
