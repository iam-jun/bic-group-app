import groupApi from '~/api/GroupApi';
import useCommunitiesStore from '~/store/entities/communities';
import showToastError from '~/store/helper/showToastError';

const updateCommunityJoinSetting = (_, _get) => async (
  communityId: string,
  groupId: string,
  isJoinApproval: boolean,
) => {
  try {
    await groupApi.updateGroupJoinSetting(groupId, isJoinApproval);

    // to update isJoinApproval status
    useCommunitiesStore.getState().actions.getCommunity(communityId);
  } catch (error) {
    console.error('updateCommunityJoinSetting error:', error);
    showToastError(error);
  }
};

export default updateCommunityJoinSetting;
