import groupApi from '~/api/GroupApi';
import { removeMemberFromMemberList } from '~/helpers/common';
import { IToastMessage } from '~/interfaces/common';
import useGroupDetailStore from '~/screens/groups/GroupDetail/store';
import showError from '~/store/helper/showError';
import Store from '~/storeRedux';
import modalActions from '~/storeRedux/modal/actions';

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

    const toastMessage: IToastMessage = {
      content: response?.meta?.message || 'common:text_success_message',
      props: { type: 'success' },
    };
    Store.store.dispatch(modalActions.showHideToastMessage(toastMessage));
  } catch (error) {
    console.error('removeGroupMember error:', error);

    showError(error);
  }
};

export default removeGroupMember;
