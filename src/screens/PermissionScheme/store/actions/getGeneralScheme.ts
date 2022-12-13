import groupApi from '~/api/GroupApi';
import APIErrorCode from '~/constants/apiErrorCode';
import { sortFixedRoles } from '~/screens/groups/helper';
import showError from '~/store/helper/showError';
import IPermissionSchemeState from '../Interface';

const getGeneralScheme = (set) => async (communityId: string) => {
  try {
    set((state: IPermissionSchemeState) => {
      state.generalScheme.loading = true;
      state.generalScheme.data = undefined;
    }, 'getGeneralScheme');

    const response = await groupApi.getGeneralScheme(communityId);

    if (response?.data) {
      const dataWithOrderedFixRole = sortFixedRoles(response.data);
      set((state: IPermissionSchemeState) => {
        state.generalScheme.loading = false;
        state.generalScheme.data = dataWithOrderedFixRole;
      }, 'getGeneralSchemeSuccess');
    } else {
      set((state: IPermissionSchemeState) => {
        state.generalScheme.loading = false;
      }, 'getGeneralSchemeFailure');
    }
  } catch (error) {
    console.error('getGeneralScheme error:', error);

    set((state: IPermissionSchemeState) => {
      state.generalScheme.loading = false;
    }, 'getGeneralSchemeError');

    if (error?.code !== APIErrorCode.Group.SCHEME_NOT_FOUND) {
      showError(error);
    }
  }
};

export default getGeneralScheme;
