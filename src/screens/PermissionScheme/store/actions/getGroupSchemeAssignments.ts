import groupApi from '~/api/GroupApi';
import showToastError from '~/store/helper/showToastError';
import IPermissionSchemeState from '../Interface';

const getGroupSchemeAssignments = (set) => async ({
  communityId, showLoading = true,
}: { communityId: string; showLoading?: boolean }) => {
  try {
    if (showLoading) {
      set((state: IPermissionSchemeState) => {
        state.assignGroupScheme.assignments.loading = true;
        state.assignGroupScheme.assignments.data = undefined;
      }, 'getGroupSchemeAssignments');
    }

    const response = await groupApi.getGroupSchemeAssignments(communityId);

    if (response?.data) {
      set((state: IPermissionSchemeState) => {
        state.assignGroupScheme.assignments.loading = false;
        state.assignGroupScheme.assignments.data = response.data;
      }, 'getGroupSchemeAssignmentsSuccess');
    } else {
      set((state: IPermissionSchemeState) => {
        state.assignGroupScheme.assignments.loading = false;
        state.assignGroupScheme.assignments.data = undefined;
      }, 'getGroupSchemeAssignmentsFailure');
    }
  } catch (error) {
    console.error('getGroupSchemeAssignments error:', error);

    set((state: IPermissionSchemeState) => {
      state.assignGroupScheme.assignments.loading = false;
      state.assignGroupScheme.assignments.data = undefined;
    }, 'getGroupSchemeAssignmentsError');

    showToastError(error);
  }
};

export default getGroupSchemeAssignments;
