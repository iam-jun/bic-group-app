import i18next from 'i18next';
import approveDeclineCode from '~/constants/approveDeclineCode';
import { IToastMessage } from '~/interfaces/common';
import { IPayloadApproveSingleCommunityMemberRequest } from '~/interfaces/ICommunity';
import useCommunitiesStore from '~/store/entities/communities';
import showToastError from '~/store/helper/showToastError';
import useModalStore from '~/store/modal';
import groupApi from '~/api/GroupApi';
import { ICommunityMemberState } from '../index';

const approveSingleCommunityMemberRequest = (get) => async (
  payload: IPayloadApproveSingleCommunityMemberRequest,
) => {
  const {
    communityId, groupId, requestId, fullName,
  } = payload || {};
  const { actions: communitiesActions } = useCommunitiesStore.getState();
  const { communityMemberRequests, actions }: ICommunityMemberState = get();
  const { total, ids, items } = communityMemberRequests || {};

  try {
    if (!groupId || !requestId) return;

    await groupApi.approveSingleGroupMemberRequest(groupId, requestId);

    // Update data state
    const requestItems = { ...items };
    delete requestItems[requestId];
    actions.setCommunityMemberRequests({
      total: total - 1,
      ids: ids.filter((item: string) => item !== requestId),
      items: requestItems,
    });

    const toastMessage: IToastMessage = {
      // TO BE REPLACED SOON, SHOULD USE MESSAGE FROM BE
      content: `${i18next.t('groups:text_approved_user')} ${fullName}`,
    };
    useModalStore.getState().actions.showToast(toastMessage);
    // to update userCount
    communitiesActions.getCommunity(communityId);
  } catch (e) {
    console.error('approveSingleCommunityMemberRequest: ', e);

    if (
      e?.code === approveDeclineCode.CANCELED
      || e?.code === approveDeclineCode.APPROVED
      || e?.code === approveDeclineCode.DECLINED
    ) {
      actions.editCommunityMemberRequest({
        id: requestId,
        data: { noticeMessage: e?.meta?.message },
      });
      return;
    }

    showToastError(e);
  }
};

export default approveSingleCommunityMemberRequest;
