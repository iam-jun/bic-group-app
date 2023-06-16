import approveDeclineCode from '~/constants/approveDeclineCode';
import useGroupDetailStore from '~/screens/groups/GroupDetail/store';
import showToastError from '~/store/helper/showToastError';
import groupApi from '~/api/GroupApi';
import { IPayloadApproveSingleGroupMemberRequest } from '~/interfaces/IGroup';
import { IGroupMemberState } from '..';
import showToastSuccess from '~/store/helper/showToastSuccess';

const approveSingleGroupMemberRequest = (get) => async (
  payload: IPayloadApproveSingleGroupMemberRequest,
) => {
  const { groupId, requestId } = payload || {};
  const { groupMemberRequests, actions }: IGroupMemberState = get();
  const { total, ids, items } = groupMemberRequests || {};

  try {
    if (!groupId || !requestId) return;

    const response = await groupApi.approveSingleGroupMemberRequest(groupId, requestId);

    // Update data state
    const requestItems = { ...items };
    delete requestItems[requestId];
    actions.setGroupMemberRequests({
      total: total - 1,
      ids: ids.filter((item: string) => item !== requestId),
      items: requestItems,
    });

    showToastSuccess(response);
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
