import groupApi from '~/api/GroupApi';
import { IRequestUpdateCommunityJoinSetting } from '~/interfaces/ICommunity';
import useMembershipPolicySettingsStore from '~/screens/groups/MembershipPolicySettings/store';
import useCommunitiesStore from '~/store/entities/communities';
import showToastError from '~/store/helper/showToastError';
import showToastSuccess from '~/store/helper/showToastSuccess';

const updateCommunityJoinSetting = (_, _get) => async (payload: IRequestUpdateCommunityJoinSetting) => {
  const { communityId, ...params } = payload;
  try {
    const response = await groupApi.updateGroupJoinSetting(params);

    // to update isJoinApproval status
    useCommunitiesStore.getState().actions.getCommunity(communityId);

    // to update settings
    useMembershipPolicySettingsStore.getState().actions.updateSettings(response?.data);

    showToastSuccess(response);
  } catch (error) {
    console.error('updateCommunityJoinSetting error:', error);
    showToastError(error);
  }
};

export default updateCommunityJoinSetting;
