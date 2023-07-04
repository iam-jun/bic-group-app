import i18next from 'i18next';

import groupApi from '~/api/GroupApi';
import GroupJoinStatus from '~/constants/GroupJoinStatus';
import useCommunitiesStore from '~/store/entities/communities';
import { ICommunity, IRequestJoinCommunity } from '~/interfaces/ICommunity';
import showToastError from '~/store/helper/showToastError';
import APIErrorCode from '~/constants/apiErrorCode';
import useModalStore from '~/store/modal';
import showToastSuccess from '~/store/helper/showToastSuccess';

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
      if (error?.code === APIErrorCode.Group.MISSIING_MEMBERSHIP_ANSWERS) {
        setTimeout(
          () => {
            useModalStore.getState().actions.showAlert({
              cancelBtn: false,
              confirmLabel: i18next.t('common:text_ok'),
              title: i18next.t('common:text_sorry_something_went_wrong'),
              content: i18next.t('common:text_pull_to_refresh'),
            });
          }, 500,
        );
        return;
      }
      showToastError(error);
    }
  };

export default joinCommunity;
