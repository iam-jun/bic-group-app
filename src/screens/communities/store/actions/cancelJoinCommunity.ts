import approveDeclineCode from '~/constants/approveDeclineCode';
import useCommunitiesStore from '~/store/entities/communities';
import groupApi from '~/api/GroupApi';
import { ICommunity, IRequestCancelJoinCommunity } from '~/interfaces/ICommunity';
import showToastSuccess from '~/store/helper/showToastSuccess';
import showToastError from '~/store/helper/showToastError';
import { ToastType } from '~/baseComponents/Toast/BaseToast';

const cancelJoinCommunity
  = (_set, _get) => async (payload: IRequestCancelJoinCommunity) => {
    const { communityId, rootGroupId } = payload;
    try {
      const response = await groupApi.cancelJoinCommunity(rootGroupId);

      useCommunitiesStore.getState().actions.updateCommunity(
        communityId,
        { joinStatus: response?.data?.joinStatus } as ICommunity,
      );

      showToastSuccess(response);
    } catch (error: any) {
      console.error('cancelJoinCommunity catch', error);

      if (error?.code === approveDeclineCode.APPROVED
        || error?.code === approveDeclineCode.DECLINED) {
        // Also update join button status in discover communities and in search resutls
        useCommunitiesStore.getState().actions.getCommunity(rootGroupId);

        // This toast just shows info message, not really an error
        return showToastError(error, ToastType.NEUTRAL);
      }

      showToastError(error);
    }
  };

export default cancelJoinCommunity;
