import groupApi from '~/api/GroupApi';
import useGroupDetailStore from '~/screens/groups/GroupDetail/store';
import showToastError from '~/store/helper/showToastError';

const updateGroupJoinSetting = (_set, _get) => async (
  { groupId, isJoinApproval }: {groupId: string; isJoinApproval: boolean},
) => {
  try {
    await groupApi.updateGroupJoinSetting(groupId, isJoinApproval);
    // to update isJoinApproval status
    useGroupDetailStore.getState().actions.getGroupDetail({ groupId });
  } catch (error) {
    console.error('updateGroupJoinSetting error:', error);
    showToastError(error);
  }
};

export default updateGroupJoinSetting;
