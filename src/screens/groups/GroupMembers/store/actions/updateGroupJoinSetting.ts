import groupApi from '~/api/GroupApi';
import useGroupDetailStore from '~/screens/groups/GroupDetail/store';
import showError from '~/store/helper/showError';

const updateGroupJoinSetting = (_set, _get) => async (
  { groupId, isJoinApproval }: {groupId: string; isJoinApproval: boolean},
) => {
  try {
    await groupApi.updateGroupJoinSetting(groupId, isJoinApproval);
    // to update isJoinApproval status
    useGroupDetailStore.getState().actions.getGroupDetail({ groupId });
  } catch (error) {
    console.error('updateGroupJoinSetting error:', error);
    showError(error);
  }
};

export default updateGroupJoinSetting;
