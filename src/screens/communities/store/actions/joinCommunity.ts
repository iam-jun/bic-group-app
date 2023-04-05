import i18next from 'i18next';

import groupApi from '~/api/GroupApi';
import GroupJoinStatus from '~/constants/GroupJoinStatus';
import { IToastMessage } from '~/interfaces/common';
import useCommunitiesStore from '~/store/entities/communities';
import { ICommunity, IRequestJoinCommunity } from '~/interfaces/ICommunity';
import showToastError from '~/store/helper/showToastError';
import showToast from '~/store/helper/showToast';

const joinCommunity
  = (_set, _get) => async (payload: IRequestJoinCommunity) => {
    const { communityId, communityName, membershipAnswers = [] } = payload;
    try {
      const response = await groupApi.joinCommunity(communityId, { membershipAnswers });
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

      if (hasRequested) {
        const toastMessage: IToastMessage = {
          content: `${i18next.t(
            'groups:text_request_join_community',
          )} ${communityName}`,
        };
        showToast(toastMessage);
        return;
      }

      const toastMessage: IToastMessage = {
        content: `${i18next.t(
          'groups:text_successfully_join_community',
        )} ${communityName}`,
      };

      showToast(toastMessage);
    } catch (error) {
      console.error('joinCommunity catch', error);
      showToastError(error);
    }
  };

export default joinCommunity;
