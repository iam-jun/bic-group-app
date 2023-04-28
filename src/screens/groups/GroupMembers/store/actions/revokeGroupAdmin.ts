import groupApi from '~/api/GroupApi';
import showToastError from '~/store/helper/showToastError';
import showToastSuccess from '~/store/helper/showToastSuccess';
import { IGroupMemberState } from '..';

const revokeGroupAdmin = (_set, get) => async (groupId: string, userId: string) => {
  try {
    const response = await groupApi.removeGroupAdmin(groupId, userId);

    const { actions, search }: IGroupMemberState = get();
    actions.getGroupMembers({ groupId, isRefreshing: true });

    // if the user is standing on search member screen,
    // need to update the current search
    const { key } = search;
    if (key.length > 0) {
      actions.getGroupSearchMembers({ groupId, silentRefresh: true, params: { key } });
    }

    showToastSuccess(response);
  } catch (error) {
    console.error('revokeGroupAdmin error:', error);
    showToastError(error);
  }
};

export default revokeGroupAdmin;
