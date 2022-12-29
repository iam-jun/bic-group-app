import groupApi from '~/api/GroupApi';
import useGroupMemberStore from '../../GroupMembers/store';
import showToastError from '~/store/helper/showToastError';
import showToastSuccess from '~/store/helper/showToastSuccess';

const revokeGroupAdmin = (_set, _get) => async (groupId: string, userId: string) => {
  try {
    const response = await groupApi.removeGroupAdmin(groupId, userId);

    useGroupMemberStore
      .getState()
      .actions
      .getGroupMembers({ groupId, isRefreshing: true });

    showToastSuccess(response);
  } catch (error) {
    console.error('revokeGroupAdmin error:', error);
    showToastError(error);
  }
};

export default revokeGroupAdmin;
