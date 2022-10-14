import groupApi from '~/api/GroupApi';
import Store from '~/storeRedux';
import appActions from '~/storeRedux/app/actions';

const updateCommunityJoinSetting = (_, get) => async (
  id: string,
  isJoinApproval: boolean,
) => {
  const { actions } = get();

  try {
    await groupApi.updateCommunityJoinSetting(id, isJoinApproval);

    // to update isJoinApproval status
    actions.getCommunity(id);
  } catch (error) {
    console.error('updateCommunityJoinSetting error:', error);
    Store.store.dispatch(appActions.setShowError(error));
  }
};

export default updateCommunityJoinSetting;
