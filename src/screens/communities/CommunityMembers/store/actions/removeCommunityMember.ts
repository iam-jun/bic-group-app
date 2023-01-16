import groupApi from '~/api/GroupApi';
import { removeMemberFromMemberList } from '~/helpers/common';
import { IRemoveCommunityMember } from '~/interfaces/ICommunity';
import useCommunitiesStore from '~/store/entities/communities';
import showToastError from '~/store/helper/showToastError';
import showToastSuccess from '~/store/helper/showToastSuccess';

const removeCommunityMember = (set, get) => async (
  { communityId, groupId, userId }: IRemoveCommunityMember,
) => {
  try {
    const response = await groupApi.removeGroupMembers(groupId, [userId]);

    const { communityMembers } = get();
    const newUpdatedData = removeMemberFromMemberList(userId, communityMembers);
    set((state) => {
      state.communityMembers = {
        ...state.communityMembers,
        ...newUpdatedData,
      };
    }, 'setCommunityMembers');

    // to update userCount
    useCommunitiesStore.getState().actions.getCommunity(communityId);

    showToastSuccess(response);
  } catch (error) {
    console.error('removeCommunityMember error:', error);

    showToastError(error);
  }
};

export default removeCommunityMember;
