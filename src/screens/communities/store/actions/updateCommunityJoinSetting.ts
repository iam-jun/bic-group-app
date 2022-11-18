import groupApi from '~/api/GroupApi';
import { ICommunity } from '~/interfaces/ICommunity';
import useCommunitiesStore from '~/store/entities/communities';
import Store from '~/storeRedux';
import appActions from '~/storeRedux/app/actions';

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
    Store.store.dispatch(appActions.setShowError(error));
  }
};

export default updateCommunityJoinSetting;
