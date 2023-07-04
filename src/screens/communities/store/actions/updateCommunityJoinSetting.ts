import groupApi from '~/api/GroupApi';
import { IRequestUpdateCommunityJoinSetting } from '~/interfaces/ICommunity';
import useCommunitiesStore from '~/store/entities/communities';
import showToastError from '~/store/helper/showToastError';
import showToastSuccess from '~/store/helper/showToastSuccess';

const updateCommunityJoinSetting = (_, _get) => async (payload: IRequestUpdateCommunityJoinSetting) => {
  const { communityId, groupId, ...settings } = payload;
  try {
    const response = await groupApi.updateGroupJoinSetting(groupId, settings);

    // to update isJoinApproval status
    useCommunitiesStore.getState().actions.getCommunity(communityId);

    showToastSuccess(response);
  } catch (error) {
    console.error('updateCommunityJoinSetting error:', error);
    showToastError(error);
  }
};

export default updateCommunityJoinSetting;
