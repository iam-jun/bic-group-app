import i18next from 'i18next';
import approveDeclineCode from '~/constants/approveDeclineCode';
import { IToastMessage } from '~/interfaces/common';
import { IPayloadDeclineSingleGroupMemberRequest } from '~/interfaces/IGroup';
import showToastError from '~/store/helper/showToastError';
import showToast from '~/store/helper/showToast';
import groupApi from '~/api/GroupApi';
import { IGroupMemberState } from '..';

const declineSingleGroupMemberRequest = (get) => async (
  payload: IPayloadDeclineSingleGroupMemberRequest,
) => {
  const { groupId, requestId, fullName } = payload || {};
  const { groupMemberRequests, actions }: IGroupMemberState = get();
  const { total, ids, items } = groupMemberRequests || {};

  try {
    if (!groupId || !requestId) return;

    await groupApi.declineSingleGroupMemberRequest(groupId, requestId);

    // Update data state
    const requestItems = { ...items };
    delete requestItems[requestId];
    actions.setGroupMemberRequests({
      total: total - 1,
      ids: ids.filter((item: string) => item !== requestId),
      items: requestItems,
    });

    const toastMessage: IToastMessage = {
      // TO BE REPLACED SOON, SHOULD USE MESSAGE FROM BE
      content: `${i18next.t('groups:text_declined_user')} ${fullName}`,
    };
    showToast(toastMessage);
  } catch (e) {
    console.error('declineSingleGroupMemberRequest: ', e);

    if (e?.code === approveDeclineCode.CANCELED
        || e?.code === approveDeclineCode.APPROVED
        || e?.code === approveDeclineCode.DECLINED) {
      actions.editGroupMemberRequest({
        id: requestId,
        data: { noticeMessage: e?.meta?.message },
      });
      return;
    }

    showToastError(e);
  }
};

export default declineSingleGroupMemberRequest;
