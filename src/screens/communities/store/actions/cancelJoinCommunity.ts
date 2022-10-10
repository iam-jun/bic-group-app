import i18next from 'i18next';
import approveDeclineCode from '~/constants/approveDeclineCode';
import GroupJoinStatus from '~/constants/GroupJoinStatus';
import { IToastMessage } from '~/interfaces/common';
import { useDiscoverCommunitiesStore } from '~/screens/Discover/components/DiscoverCommunities/store';
import useCommunitiesStore from '~/store/entities/communities';
import Store from '~/storeRedux';
import appActions from '~/storeRedux/app/actions';
import groupsActions from '~/storeRedux/groups/actions';
import modalActions from '~/storeRedux/modal/actions';
import groupApi from '~/api/GroupApi';
import { useDiscoverCommunitiesSearchStore } from '~/screens/Discover/components/SearchDiscoverCommunity/store';

const cancelJoinCommunity
  = (_set, _get) => async (communityId: string, communityName: string) => {
    try {
      await groupApi.cancelJoinCommunity(communityId);

      // update button Join/Cancel/View status on Discover communities
      Store.store.dispatch(
        groupsActions.editDiscoverCommunityItem({
          id: communityId,
          data: { joinStatus: GroupJoinStatus.VISITOR },
        }),
      );

      useDiscoverCommunitiesStore
        .getState()
        .actions.setDiscoverCommunities(communityId, {
          joinStatus: GroupJoinStatus.VISITOR,
        });
      useDiscoverCommunitiesSearchStore
        .getState()
        .actions.setDiscoverCommunitiesSearchItem(communityId, {
          joinStatus: GroupJoinStatus.VISITOR,
        });

      useCommunitiesStore.getState().actions.getCommunity(communityId);

      const toastMessage: IToastMessage = {
        content: `${i18next.t(
          'groups:text_cancel_join_community',
        )} ${communityName}`,
      };

      Store.store.dispatch(modalActions.showHideToastMessage(toastMessage));
    } catch (error: any) {
      console.error('cancelJoinCommunity catch', error);

      if (error?.code === approveDeclineCode.APPROVED) {
        Store.store.dispatch(
          groupsActions.editDiscoverCommunityItem({
            id: communityId,
            data: { joinStatus: GroupJoinStatus.MEMBER },
          }),
        );
        useCommunitiesStore.getState().actions.getCommunity(communityId);
      }

      Store.store.dispatch(appActions.setShowError(error));
    }
  };

export default cancelJoinCommunity;
