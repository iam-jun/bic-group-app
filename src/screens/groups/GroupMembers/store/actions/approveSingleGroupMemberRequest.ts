import i18next from 'i18next';
import approveDeclineCode from '~/constants/approveDeclineCode';
import { IToastMessage } from '~/interfaces/common';
import useGroupDetailStore from '~/screens/groups/GroupDetail/store';
import showToastError from '~/store/helper/showToastError';
import showToast from '~/store/helper/showToast';
import groupApi from '~/api/GroupApi';
import { IPayloadApproveSingleGroupMemberRequest } from '~/interfaces/IGroup';
import { IGroupMemberState } from '..';

const approveSingleGroupMemberRequest = (get) => async (
  payload: IPayloadApproveSingleGroupMemberRequest,
) => {
  const { groupId, requestId, fullName } = payload || {};
  const { groupMemberRequests, actions }: IGroupMemberState = get();
  const { total, ids, items } = groupMemberRequests || {};

  try {
    if (!groupId || !requestId) return;

    await groupApi.approveSingleGroupMemberRequest(groupId, requestId);

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
      content: `${i18next.t('groups:text_approved_user')} ${fullName}`,
    };
    showToast(toastMessage);
    // to update userCount
    useGroupDetailStore.getState().actions.getGroupDetail({ groupId });
  } catch (e) {
    console.error('approveSingleGroupMemberRequest: ', e);

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

export default approveSingleGroupMemberRequest;
