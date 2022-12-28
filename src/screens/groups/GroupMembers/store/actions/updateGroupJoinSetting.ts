import groupApi from '~/api/GroupApi';
import showError from '~/store/helper/showError';
import storeRedux from '~/storeRedux';
import groupsActions from '~/storeRedux/groups/actions';

const updateGroupJoinSetting = (_set, _get) => async (
  { groupId, isJoinApproval }: {groupId: string; isJoinApproval: boolean},
) => {
  try {
    await groupApi.updateGroupJoinSetting(groupId, isJoinApproval);
    // to update isJoinApproval status
    storeRedux.store.dispatch(groupsActions.getGroupDetail({ groupId }));
  } catch (error) {
    console.error('updateGroupJoinSetting error:', error);
    showError(error);
  }
};

export default updateGroupJoinSetting;
