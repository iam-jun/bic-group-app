import groupApi from '~/api/GroupApi';
import useMenuController from '~/screens/Menu/store';
import useCommunitiesStore from '~/store/entities/communities';
import useYourCommunitiesStore from '../../Communities/components/YourCommunities/store';
import showToastSuccess from '~/store/helper/showToastSuccess';
import showToastError from '~/store/helper/showToastError';
import useManagedStore from '~/screens/communities/Communities/components/Managed/store';
import useMyPermissionsStore from '~/store/permissions';
import { IRequestLeaveCommunity } from '~/interfaces/ICommunity';

const leaveCommunity = (_set, _get) => async (payload: IRequestLeaveCommunity) => {
  try {
    const { communityId, rootGroupId } = payload;

    const response = await groupApi.leaveCommunity(rootGroupId);

    useCommunitiesStore.getState().actions.getCommunity(communityId);

    // refresh list in screen Managed
    useManagedStore.getState().actions.getManaged(true);

    // refresh joined communities
    useMenuController.getState().actions.getJoinedCommunities();
    useYourCommunitiesStore.getState().actions.getYourCommunities({ isRefreshing: true });

    // refresh permissions
    useMyPermissionsStore.getState().actions.getMyPermissions();

    showToastSuccess(response);
  } catch (err) {
    console.error('leaveCommunity error:', err);
    showToastError(err);
  }
};

export default leaveCommunity;
