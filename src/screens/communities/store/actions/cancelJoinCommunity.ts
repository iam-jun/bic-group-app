import i18next from 'i18next';
import approveDeclineCode from '~/constants/approveDeclineCode';
import GroupJoinStatus from '~/constants/GroupJoinStatus';
import { IToastMessage } from '~/interfaces/common';
import useCommunitiesStore from '~/store/entities/communities';
import Store from '~/storeRedux';
import modalActions from '~/storeRedux/modal/actions';
import groupApi from '~/api/GroupApi';
import { ICommunity } from '~/interfaces/ICommunity';
import showError from '~/store/helper/showError';

const cancelJoinCommunity
  = (_set, _get) => async (communityId: string, communityName: string) => {
    try {
      await groupApi.cancelJoinCommunity(communityId);

      useCommunitiesStore.getState().actions.updateCommunity(
        communityId,
        { joinStatus: GroupJoinStatus.VISITOR } as ICommunity,
      );

      const toastMessage: IToastMessage = {
        content: `${i18next.t(
          'groups:text_cancel_join_community',
        )} ${communityName}`,
      };

      Store.store.dispatch(modalActions.showHideToastMessage(toastMessage));
    } catch (error: any) {
      console.error('cancelJoinCommunity catch', error);

      if (error?.code === approveDeclineCode.APPROVED
        || error?.code === approveDeclineCode.DECLINED) {
        // Also update join button status in discover communities and in search resutls
        useCommunitiesStore.getState().actions.getCommunity(communityId);

        // This toast just shows info message, not really an error
        return showError(error, 'neutral');
      }

      showError(error);
    }
  };

export default cancelJoinCommunity;
