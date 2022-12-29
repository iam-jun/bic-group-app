import i18next from 'i18next';

import groupApi from '~/api/GroupApi';
import GroupJoinStatus from '~/constants/GroupJoinStatus';
import { IToastMessage } from '~/interfaces/common';
import useCommunitiesStore from '~/store/entities/communities';
import Store from '~/storeRedux';
import groupsActions from '~/storeRedux/groups/actions';
import { ICommunity } from '~/interfaces/ICommunity';
import showToastError from '~/store/helper/showToastError';
import useModalStore from '~/store/modal';

const joinCommunity
  = (_set, _get) => async (communityId: string, communityName: string) => {
    try {
      const response = await groupApi.joinCommunity(communityId);
      const joinStatus = response?.data?.joinStatus;
      const hasRequested = joinStatus === GroupJoinStatus.REQUESTED;
      const userCount = useCommunitiesStore.getState().data?.[communityId]?.userCount || 0;

      // update button Join/Cancel/View status on Discover communities
      Store.store.dispatch(
        groupsActions.editDiscoverCommunityItem({
          id: communityId,
          data: { joinStatus },
        }),
      );

      useCommunitiesStore.getState().actions.updateCommunity(
        communityId,
        {
          joinStatus,
          userCount: hasRequested ? userCount : userCount + 1,
        } as ICommunity,
      );

      if (hasRequested) {
        const toastMessage: IToastMessage = {
          content: `${i18next.t(
            'groups:text_request_join_community',
          )} ${communityName}`,
        };
        useModalStore.getState().actions.showToast(toastMessage);
        return;
      }

      const toastMessage: IToastMessage = {
        content: `${i18next.t(
          'groups:text_successfully_join_community',
        )} ${communityName}`,
      };

      useModalStore.getState().actions.showToast(toastMessage);
    } catch (error) {
      console.error('joinCommunity catch', error);
      showToastError(error);
    }
  };

export default joinCommunity;
