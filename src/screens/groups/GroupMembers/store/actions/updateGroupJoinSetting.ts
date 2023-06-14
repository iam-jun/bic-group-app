import groupApi from '~/api/GroupApi';
import { IPayloadUpdateGroupJoinSetting } from '~/interfaces/IGroup';
import useGroupDetailStore from '~/screens/groups/GroupDetail/store';
import showToastError from '~/store/helper/showToastError';

const updateGroupJoinSetting = (_set, _get) => async (payload: IPayloadUpdateGroupJoinSetting) => {
  const { groupId, ...settings } = payload;
  try {
    await groupApi.updateGroupJoinSetting(groupId, settings);
    // to update isJoinApproval status
    useGroupDetailStore.getState().actions.getGroupDetail({ groupId });
  } catch (error) {
    console.error('updateGroupJoinSetting error:', error);
    showToastError(error);
  }
};

export default updateGroupJoinSetting;
