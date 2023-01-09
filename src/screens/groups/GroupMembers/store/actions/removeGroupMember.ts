import groupApi from '~/api/GroupApi';
import { removeMemberFromMemberList } from '~/helpers/common';
import useGroupDetailStore from '~/screens/groups/GroupDetail/store';
import showToastError from '~/store/helper/showToastError';
import showToastSuccess from '~/store/helper/showToastSuccess';

const removeGroupMember = (set, get) => async (
  { groupId, userId }: {groupId: string; userId: string},
) => {
  try {
    const response = await groupApi.removeGroupMembers(groupId, [userId]);

    const { groupMembers } = get() || {};
    const newUpdatedData = removeMemberFromMemberList(userId, groupMembers);
    set((state) => {
      state.groupMembers = {
        ...state.groupMembers,
        ...newUpdatedData,
      };
    }, 'setGroupMembers');

    // to update userCount
    useGroupDetailStore.getState().actions.getGroupDetail({ groupId });

    showToastSuccess(response);
  } catch (error) {
    console.error('removeGroupMember error:', error);

    showToastError(error);
  }
};

export default removeGroupMember;
