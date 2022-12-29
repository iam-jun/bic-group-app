import groupApi from '~/api/GroupApi';
import showToastError from '~/store/helper/showToastError';
import IPermissionSchemeState from '../Interface';

const getPermissionCategories = (set) => async (scope?: 'SYSTEM' | 'COMMUNITY' | 'GROUP') => {
  try {
    set((state: IPermissionSchemeState) => {
      state.categories.loading = true;
      state.categories.data = undefined;
    }, 'getPermissionCategories');

    const response = await groupApi.getPermissionCategories(scope);

    if (response?.data) {
      set((state: IPermissionSchemeState) => {
        state.categories.loading = false;
        state.categories.data = response.data;
      }, 'getPermissionCategoriesSuccess');
    } else {
      set((state: IPermissionSchemeState) => {
        state.categories.loading = false;
      }, 'getPermissionCategoriesFailure');
    }
  } catch (error) {
    console.error('getPermissionCategories error:', error);

    set((state: IPermissionSchemeState) => {
      state.categories.loading = false;
    }, 'getPermissionCategoriesError');

    showToastError(error);
  }
};

export default getPermissionCategories;
