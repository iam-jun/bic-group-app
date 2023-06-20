import approveDeclineCode from '~/constants/approveDeclineCode';
import { IPayloadDeclineSingleGroupMemberRequest } from '~/interfaces/IGroup';
import showToastError from '~/store/helper/showToastError';
import groupApi from '~/api/GroupApi';
import { IGroupMemberState } from '..';
import showToastSuccess from '~/store/helper/showToastSuccess';

const declineSingleGroupMemberRequest = (get) => async (
  payload: IPayloadDeclineSingleGroupMemberRequest,
) => {
  const { groupId, requestId } = payload || {};
  const { groupMemberRequests, actions }: IGroupMemberState = get();
  const { total, ids, items } = groupMemberRequests || {};

  try {
    if (!groupId || !requestId) return;

    const response = await groupApi.declineSingleGroupMemberRequest(groupId, requestId);

    // Update data state
    const requestItems = { ...items };
    delete requestItems[requestId];
    actions.setGroupMemberRequests({
      total: total - 1,
      ids: ids.filter((item: string) => item !== requestId),
      items: requestItems,
    });

    showToastSuccess(response);
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
