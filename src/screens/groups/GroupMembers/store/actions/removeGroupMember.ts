import groupApi from '~/api/GroupApi';
import { removeMemberFromMemberList } from '~/helpers/common';
import useGroupDetailStore from '~/screens/groups/GroupDetail/store';
import showToastError from '~/store/helper/showToastError';
import showToastSuccess from '~/store/helper/showToastSuccess';
import { IGroupMemberState } from '..';

const removeGroupMember = (set, get) => async (
  { groupId, userId }: {groupId: string; userId: string},
) => {
  try {
    const response = await groupApi.removeGroupMembers(groupId, [userId]);

    const { groupMembers, search, actions }: IGroupMemberState = get() || {};
    const newUpdatedData = removeMemberFromMemberList(userId, groupMembers);
    set((state) => {
      state.groupMembers = {
        ...state.groupMembers,
        ...newUpdatedData,
      };
    }, 'setGroupMembers');

    // to update userCount
    useGroupDetailStore.getState().actions.getGroupDetail({ groupId });

    // if the user is standing on search member screen,
    // need to update the current search
    const { key } = search;
    if (key.length > 0) {
      actions.getGroupSearchMembers({ groupId, silentRefresh: true, params: { key } });
    }

    showToastSuccess(response);
  } catch (error) {
    console.error('removeGroupMember error:', error);

    showToastError(error);
  }
};

export default removeGroupMember;
