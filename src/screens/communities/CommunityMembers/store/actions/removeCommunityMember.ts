import groupApi from '~/api/GroupApi';
import useRemoveMemberFromMemberList from '~/hooks/useRemoveMemberFromMemberList';
import { IRemoveCommunityMember } from '~/interfaces/ICommunity';
import { IToastMessage } from '~/interfaces/common';
import useCommunitiesStore from '~/store/entities/communities';
import showError from '~/store/helper/showError';
import Store from '~/storeRedux';
import modalActions from '~/storeRedux/modal/actions';

const removeCommunityMember = (set, get) => async (
  { communityId, groupId, userId }: IRemoveCommunityMember,
) => {
  try {
    const response = await groupApi.removeGroupMembers(groupId, [userId]);

    const { communityMembers } = get();
    const newUpdatedData = useRemoveMemberFromMemberList(userId, communityMembers);
    set((state) => {
      state.communityMembers = {
        ...state.communityMembers,
        ...newUpdatedData,
      };
    }, 'setCommunityMembers');

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
