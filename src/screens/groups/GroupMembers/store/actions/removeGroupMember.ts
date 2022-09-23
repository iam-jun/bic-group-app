import groupApi from '~/api/GroupApi';
import { IToastMessage } from '~/interfaces/common';
import { removeMemberFromMemberList } from '~/screens/communities/CommunityMembers/store/actions/removeCommunityMember';
import Store from '~/storeRedux';
import groupsActions from '~/storeRedux/groups/actions';
import modalActions from '~/storeRedux/modal/actions';

const removeGroupMember = () => async (
  { groupId, userId }: {groupId: string; userId: string},
) => {
  try {
    const response = await groupApi.removeGroupMembers(groupId, [userId]);

    const newUpdatedData = removeMemberFromMemberList(userId, 'group');
    Store.store.dispatch(groupsActions.setGroupMembers(newUpdatedData));

    // to update userCount
    Store.store.dispatch(groupsActions.getGroupDetail({ groupId }));

    const toastMessage: IToastMessage = {
      content: response?.meta?.message || 'common:text_success_message',
      props: { type: 'success' },
    };
    Store.store.dispatch(modalActions.showHideToastMessage(toastMessage));
  } catch (error) {
    console.error('removeGroupMember error:', error);

    // TODO: use showError helper once merged with BEIN-8192
    Store.store.dispatch(modalActions.showHideToastMessage({
      content: error?.meta?.errors?.[0]?.message
        || error?.meta?.message
        || 'common:text_error_message',
      props: { type: 'error' },
    }));
  }
};

export default removeGroupMember;
