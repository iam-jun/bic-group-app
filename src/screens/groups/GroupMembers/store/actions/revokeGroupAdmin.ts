import groupApi from '~/api/GroupApi';
import showToastError from '~/store/helper/showToastError';
import showToastSuccess from '~/store/helper/showToastSuccess';

const revokeGroupAdmin = (_set, get) => async (groupId: string, userId: string) => {
  try {
    const response = await groupApi.removeGroupAdmin(groupId, userId);

    const { actions } = get();
    actions.getGroupMembers({ groupId, isRefreshing: true });

    showToastSuccess(response);
  } catch (error) {
    console.error('revokeGroupAdmin error:', error);
    showToastError(error);
  }
};

export default revokeGroupAdmin;
