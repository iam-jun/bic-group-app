import groupApi from '~/api/GroupApi';
import showToastError from '~/store/helper/showToastError';
import IPermissionSchemeState from '../Interface';

const deleteGeneralScheme = (set) => async (communityId: string) => {
  try {
    set((state: IPermissionSchemeState) => {
      state.generalScheme.loading = false;
      state.generalScheme.deleting = true;
    }, 'deleteGeneralScheme');

    const response = await groupApi.deleteGeneralScheme(communityId);

    if (response?.data) {
      set((state: IPermissionSchemeState) => {
        state.generalScheme.loading = false;
        state.generalScheme.deleting = false;
        state.generalScheme.data = undefined;
      }, 'deleteGeneralSchemeSuccess');
    } else {
      set((state: IPermissionSchemeState) => {
        state.generalScheme.loading = false;
        state.generalScheme.deleting = false;
      }, 'deleteGeneralSchemeFailure');
    }
  } catch (error) {
    console.error('deleteGeneralScheme error:', error);

    set((state: IPermissionSchemeState) => {
      state.generalScheme.loading = false;
      state.generalScheme.deleting = false;
    }, 'deleteGeneralSchemeError');

    showToastError(error);
  }
};

export default deleteGeneralScheme;
