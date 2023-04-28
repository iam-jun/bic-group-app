import groupApi from '~/api/GroupApi';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import { CommunityPrivacyType } from '~/constants/privacyTypes';
import useMenuController from '~/screens/Menu/store';
import useCommunitiesStore from '~/store/entities/communities';
import useYourCommunitiesStore from '../../Communities/components/YourCommunities/store';
import showToastSuccess from '~/store/helper/showToastSuccess';
import showToastError from '~/store/helper/showToastError';
import useManagedStore from '~/screens/communities/Communities/components/Managed/store';

const rootNavigation = withNavigation(rootNavigationRef);

const leaveCommunity = (_set, _get) => async (
  communityId: string,
  privacy: CommunityPrivacyType,
) => {
  try {
    const response = await groupApi.leaveCommunity(communityId);

    if (privacy === CommunityPrivacyType.SECRET) {
      rootNavigation.popToTop();
    } else {
      useCommunitiesStore.getState().actions.getCommunity(communityId);
    }

    // refresh list in screen Managed
    useManagedStore.getState().actions.getManaged(true);

    // refresh joined communities
    useMenuController.getState().actions.getJoinedCommunities();
    useYourCommunitiesStore.getState().actions.getYourCommunities(true);

    showToastSuccess(response);
  } catch (err) {
    console.error('leaveCommunity error:', err);
    showToastError(err);
  }
};

export default leaveCommunity;
