import groupApi from '~/api/GroupApi';
import showToastError from '~/store/helper/showToastError';
import { IMyPermissionsState } from '../index';

const getMyPermissions = (set, get) => async () => {
  const { loading } = get();
  if (loading) return;

  try {
    set((state: IMyPermissionsState) => {
      state.loading = true;
    }, 'getMyPermissions');

    const response = await groupApi.getMyPermissions();

    set((state: IMyPermissionsState) => {
      state.loading = false;
      state.data = response.data;
    }, 'getMyPermissionsSuccess');
  } catch (error) {
    console.error('getMyPermissions error:', error);

    set((state: IMyPermissionsState) => {
      state.loading = false;
    }, 'getMyPermissionsError');

    showToastError(error);
  }
};

export default getMyPermissions;
