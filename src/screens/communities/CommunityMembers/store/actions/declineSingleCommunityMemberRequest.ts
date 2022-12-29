import i18next from 'i18next';
import { IToastMessage } from '~/interfaces/common';
import groupApi from '~/api/GroupApi';
import approveDeclineCode from '~/constants/approveDeclineCode';
import showToastError from '~/store/helper/showToastError';
import useModalStore from '~/store/modal';
import { IPayloadDeclineSingleCommunityMemberRequest } from '~/interfaces/ICommunity';
import { ICommunityMemberState } from '../index';

const declineSingleCommunityMemberRequest = (get) => async (
  payload: IPayloadDeclineSingleCommunityMemberRequest,
) => {
  const { groupId, requestId, fullName } = payload || {};
  const { communityMemberRequests, actions }: ICommunityMemberState = get();
  const { total, ids, items } = communityMemberRequests || {};

  try {
    if (!groupId || !requestId) return;

    await groupApi.declineSingleGroupMemberRequest(groupId, requestId);

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
      content: `${i18next.t('groups:text_declined_user')} ${fullName}`,
    };
    useModalStore.getState().actions.showToast(toastMessage);
  } catch (e) {
    console.error('declineSingleCommunityMemberRequest: ', e);

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

export default declineSingleCommunityMemberRequest;
