import groupApi from '~/api/GroupApi';
import useRemoveMemberFromMemberList from '~/hooks/useRemoveMemberFromMemberList';
import { IToastMessage } from '~/interfaces/common';
import useCommunitiesStore from '~/store/entities/communities';
import showError from '~/store/helper/showError';
import Store from '~/storeRedux';
import groupsActions from '~/storeRedux/groups/actions';
import modalActions from '~/storeRedux/modal/actions';

const removeCommunityMember = () => async (
  { communityId, groupId, userId }: {communityId: string; groupId: string; userId: string},
) => {
  try {
    const response = await groupApi.removeGroupMembers(groupId, [userId]);

    const newUpdatedData = useRemoveMemberFromMemberList(userId, 'community');
    Store.store.dispatch(groupsActions.setCommunityMembers(newUpdatedData));

    // to update userCount
    useCommunitiesStore.getState().actions.getCommunity(communityId);

    const toastMessage: IToastMessage = {
      content: response?.meta?.message || 'common:text_success_message',
      props: { type: 'success' },
    };
    Store.store.dispatch(modalActions.showHideToastMessage(toastMessage));
  } catch (error) {
    console.error('removeCommunityMember error:', error);

    showError(error);
  }
};

export default removeCommunityMember;
