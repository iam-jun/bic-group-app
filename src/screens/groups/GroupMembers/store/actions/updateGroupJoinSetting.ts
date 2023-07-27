import groupApi from '~/api/GroupApi';
import { IPayloadUpdateGroupJoinSetting } from '~/interfaces/IGroup';
import useGroupDetailStore from '~/screens/groups/GroupDetail/store';
import useMembershipPolicySettingsStore from '~/screens/groups/MembershipPolicySettings/store';
import showToastError from '~/store/helper/showToastError';
import showToastSuccess from '~/store/helper/showToastSuccess';

const updateGroupJoinSetting = (_set, _get) => async (payload: IPayloadUpdateGroupJoinSetting) => {
  const { groupId } = payload;
  try {
    const response = await groupApi.updateGroupJoinSetting(payload);
    // to update isJoinApproval status
    useGroupDetailStore.getState().actions.getGroupDetail({ groupId });

    // to update settings
    useMembershipPolicySettingsStore.getState().actions.updateSettings(response?.data);

    showToastSuccess(response);
  } catch (error) {
    console.error('updateGroupJoinSetting error:', error);
    showToastError(error);
  }
};

export default updateGroupJoinSetting;
