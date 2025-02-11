import groupApi from '~/api/GroupApi';
import GroupJoinStatus from '~/constants/GroupJoinStatus';
import useCommunitiesStore from '~/store/entities/communities';
import { ICommunity, IRequestJoinCommunity } from '~/interfaces/ICommunity';
import showToastError from '~/store/helper/showToastError';
import APIErrorCode from '~/constants/apiErrorCode';
import showToastSuccess from '~/store/helper/showToastSuccess';
import { showAlertRefreshPage } from '~/helpers/common';

const joinCommunity
  = (_set, _get) => async (payload: IRequestJoinCommunity) => {
    const {
      rootGroupId, communityId, membershipAnswers = [],
    } = payload;
    try {
      const response = await groupApi.joinCommunity(rootGroupId, { membershipAnswers });
      const joinStatus = response?.data?.joinStatus;
      const hasRequested = joinStatus === GroupJoinStatus.REQUESTED;
      const userCount = useCommunitiesStore.getState().data?.[communityId]?.userCount || 0;

      useCommunitiesStore.getState().actions.updateCommunity(
        communityId,
        {
          joinStatus,
          userCount: hasRequested ? userCount : userCount + 1,
        } as ICommunity,
      );

      showToastSuccess(response);
    } catch (error) {
      console.error('joinCommunity catch', error);
      if (
        error?.code === APIErrorCode.Group.MISSIING_MEMBERSHIP_ANSWERS
        || error?.code === APIErrorCode.Common.FORBIDDEN
      ) {
        showAlertRefreshPage();
        return;
      }
      showToastError(error);
    }
  };

export default joinCommunity;
