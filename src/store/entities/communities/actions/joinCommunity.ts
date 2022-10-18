import i18next from 'i18next';

import groupApi from '~/api/GroupApi';
import GroupJoinStatus from '~/constants/GroupJoinStatus';
import { IToastMessage } from '~/interfaces/common';
import Store from '~/storeRedux';
import appActions from '~/storeRedux/app/actions';
import groupsActions from '~/storeRedux/groups/actions';
import modalActions from '~/storeRedux/modal/actions';

const joinCommunity
  = (_set, get) => async (communityId: string, communityName: string) => {
    const { actions } = get();
    try {
      const response = await groupApi.joinCommunity(communityId);
      const joinStatus = response?.data?.joinStatus;
      const hasRequested = joinStatus === GroupJoinStatus.REQUESTED;

      // update button Join/Cancel/View status on Discover communities
      Store.store.dispatch(
        groupsActions.editDiscoverCommunityItem({
          id: communityId,
          data: { joinStatus },
        }),
      );

      actions.getCommunity(communityId);

      if (hasRequested) {
        const toastMessage: IToastMessage = {
          content: `${i18next.t(
            'groups:text_request_join_community',
          )} ${communityName}`,
        };
        Store.store.dispatch(modalActions.showHideToastMessage(toastMessage));
        return;
      }

      const toastMessage: IToastMessage = {
        content: `${i18next.t(
          'groups:text_successfully_join_community',
        )} ${communityName}`,
      };

      Store.store.dispatch(modalActions.showHideToastMessage(toastMessage));
    } catch (error) {
      console.error('joinCommunity catch', error);
      Store.store.dispatch(appActions.setShowError(error));
    }
  };

export default joinCommunity;
