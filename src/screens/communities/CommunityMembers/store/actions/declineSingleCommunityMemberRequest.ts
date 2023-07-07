import groupApi from '~/api/GroupApi';
import approveDeclineCode from '~/constants/approveDeclineCode';
import showToastSuccess from '~/store/helper/showToastSuccess';
import showToastError from '~/store/helper/showToastError';
import { IPayloadDeclineSingleCommunityMemberRequest } from '~/interfaces/ICommunity';
import { ICommunityMemberState } from '../index';

const declineSingleCommunityMemberRequest = (get) => async (
  payload: IPayloadDeclineSingleCommunityMemberRequest,
) => {
  const { groupId, requestId } = payload || {};
  const { communityMemberRequests, actions }: ICommunityMemberState = get();
  const { total, ids, items } = communityMemberRequests || {};

  try {
    if (!groupId || !requestId) return;

    const response = await groupApi.declineSingleGroupMemberRequest(groupId, requestId);

    // Update data state
    const requestItems = { ...items };
    delete requestItems[requestId];
    actions.setCommunityMemberRequests({
      total: total - 1,
      ids: ids.filter((item: string) => item !== requestId),
      items: requestItems,
    });

    showToastSuccess(response);
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
