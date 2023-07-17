import groupApi from '~/api/GroupApi';
import { IPayloadUpdateGroupJoinSetting } from '~/interfaces/IGroup';
import useGroupDetailStore from '~/screens/groups/GroupDetail/store';
import showToastError from '~/store/helper/showToastError';
import showToastSuccess from '~/store/helper/showToastSuccess';

const updateGroupJoinSetting = (_set, _get) => async (payload: IPayloadUpdateGroupJoinSetting) => {
  const { groupId, ...settings } = payload;
  try {
    const response = await groupApi.updateGroupJoinSetting(groupId, settings);
    // to update isJoinApproval status
    useGroupDetailStore.getState().actions.getGroupDetail({ groupId });

    showToastSuccess(response);
  } catch (error) {
    console.error('updateGroupJoinSetting error:', error);
    showToastError(error);
  }
};

export default updateGroupJoinSetting;
