import groupApi from '~/api/GroupApi';
import showToastError from '~/store/helper/showToastError';
import showToastSuccess from '~/store/helper/showToastSuccess';

const assignGroupAdmin = (_set, _get) => async (groupId: string, userIds: string[]) => {
  try {
    const response = await groupApi.setGroupAdmin(groupId, userIds);

    const { actions } = _get();
    actions.getGroupMembers({ groupId, isRefreshing: true });

    showToastSuccess(response);
  } catch (error) {
    console.error('assignGroupAdmin error:', error);
    showToastError(error);
  }
};

export default assignGroupAdmin;
