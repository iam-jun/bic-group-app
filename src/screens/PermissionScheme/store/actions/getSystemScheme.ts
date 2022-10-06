import groupApi from '~/api/GroupApi';
import { sortFixedRoles } from '~/screens/groups/helper';
import showError from '~/store/helper/showError';
import IPermissionSchemeState from '../Interface';

const getSystemScheme = (set) => async () => {
  try {
    set((state: IPermissionSchemeState) => {
      state.systemScheme.loading = true;
      state.systemScheme.data = undefined;
    }, 'getSystemScheme');

    const response = await groupApi.getSystemScheme();

    if (response?.data) {
      const dataWithOrderedFixRole = sortFixedRoles(response.data);
      set((state: IPermissionSchemeState) => {
        state.systemScheme.loading = false;
        state.systemScheme.data = dataWithOrderedFixRole;
      }, 'getSystemSchemeSuccess');
    } else {
      set((state: IPermissionSchemeState) => {
        state.systemScheme.loading = false;
      }, 'getSystemSchemeFailure');
    }
  } catch (error) {
    console.error('getSystemScheme error:', error);

    set((state: IPermissionSchemeState) => {
      state.systemScheme.loading = false;
    }, 'getSystemSchemeError');

    showError(error);
  }
};

export default getSystemScheme;
