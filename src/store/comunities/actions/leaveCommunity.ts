import groupApi from '~/api/GroupApi';
import { IToastMessage } from '~/interfaces/common';
import groupsActions from '~/storeRedux/groups/actions';
import modalActions from '~/storeRedux/modal/actions';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import { CommunityPrivacyType } from '~/constants/privacyTypes';
import GroupJoinStatus from '~/constants/GroupJoinStatus';
import API_ERROR_CODE from '~/constants/apiErrorCode';
import useJoinedCommunitiesStore from '~/screens/Menu/store';
import Store from '~/storeRedux';
import { useDiscoverCommunitiesStore } from '~/screens/Discover/components/DiscoverCommunities/store';
import { useDiscoverCommunitiesSearchStore } from '~/screens/Discover/components/SearchDiscoverCommunity/store';

const rootNavigation = withNavigation(rootNavigationRef);

const leaveCommunity = (_set, get) => async (
  communityId: string,
  privacy: CommunityPrivacyType,
) => {
  const { actions } = get();
  try {
    await groupApi.leaveCommunity(communityId);

    // update button Join/Cancel/View status on Discover community
    Store.store.dispatch(groupsActions.editDiscoverCommunityItem({
      id: communityId,
      data: { joinStatus: GroupJoinStatus.VISITOR },
    }));

    useDiscoverCommunitiesStore
      .getState()
      .actions.setDiscoverCommunities(communityId, { joinStatus: GroupJoinStatus.VISITOR });
    useDiscoverCommunitiesSearchStore
      .getState()
      .actions.setDiscoverCommunitiesSearchItem(communityId, { joinStatus: GroupJoinStatus.VISITOR });

    if (privacy === CommunityPrivacyType.SECRET) {
      rootNavigation.popToTop();
    } else {
      actions.getCommunity(communityId);
    }

    // refresh joined communities
    Store.store.dispatch(groupsActions.getMyCommunities({ refreshNoLoading: true }));
    useJoinedCommunitiesStore.getState().getJoinedCommunities();

    const toastMessage: IToastMessage = {
      content: 'communities:modal_confirm_leave_community:success_message',
      props: { type: 'success' },
    };
    Store.store.dispatch(modalActions.showHideToastMessage(toastMessage));
  } catch (err) {
    console.error('leaveCommunity error:', err);

    // TODO: use showError helper once merged with BEIN-8192

    if (err.code === API_ERROR_CODE.GROUP.REVOKE_ACCOUNT_OWNER) {
      return Store.store.dispatch(modalActions.showHideToastMessage({
        content: 'groups:error:owner_leave_community',
        props: { type: 'error' },
      }));
    }

    if (err.code === API_ERROR_CODE.GROUP.LAST_ADMIN_LEAVE) {
      return Store.store.dispatch(modalActions.showHideToastMessage({
        content: 'groups:error:last_admin_inner_group_leave',
        props: { type: 'error' },
      }));
    }
  }
};

export default leaveCommunity;
