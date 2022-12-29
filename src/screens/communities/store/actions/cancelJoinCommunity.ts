import i18next from 'i18next';
import approveDeclineCode from '~/constants/approveDeclineCode';
import GroupJoinStatus from '~/constants/GroupJoinStatus';
import { IToastMessage } from '~/interfaces/common';
import useCommunitiesStore from '~/store/entities/communities';
import groupApi from '~/api/GroupApi';
import { ICommunity } from '~/interfaces/ICommunity';
import showToastError from '~/store/helper/showToastError';
import { ToastType } from '~/baseComponents/Toast/BaseToast';
import useModalStore from '~/store/modal';

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

      useModalStore.getState().actions.showToast(toastMessage);
    } catch (error: any) {
      console.error('cancelJoinCommunity catch', error);

      if (error?.code === approveDeclineCode.APPROVED
        || error?.code === approveDeclineCode.DECLINED) {
        // Also update join button status in discover communities and in search resutls
        useCommunitiesStore.getState().actions.getCommunity(communityId);

        // This toast just shows info message, not really an error
        return showToastError(error, ToastType.NEUTRAL);
      }

      showToastError(error);
    }
  };

export default cancelJoinCommunity;
