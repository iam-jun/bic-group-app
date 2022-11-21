import groupApi from '~/api/GroupApi';
import { ICommunity } from '~/interfaces/ICommunity';
import useCommunitiesStore from '~/store/entities/communities';
import showError from '~/store/helper/showError';

const updateCommunityJoinSetting = (_, _get) => async (
  id: string,
  isJoinApproval: boolean,
) => {
  try {
    await groupApi.updateCommunityJoinSetting(id, isJoinApproval);

    // to update isJoinApproval status
    useCommunitiesStore.getState().actions.updateCommunity(
      id,
      { settings: { isJoinApproval } } as ICommunity,
    );
  } catch (error) {
    console.error('updateCommunityJoinSetting error:', error);
    showError(error);
  }
};

export default updateCommunityJoinSetting;
