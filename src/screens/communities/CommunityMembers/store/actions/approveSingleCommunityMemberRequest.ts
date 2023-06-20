import approveDeclineCode from '~/constants/approveDeclineCode';
import { IPayloadApproveSingleCommunityMemberRequest } from '~/interfaces/ICommunity';
import useCommunitiesStore from '~/store/entities/communities';
import showToastSuccess from '~/store/helper/showToastSuccess';
import showToastError from '~/store/helper/showToastError';
import groupApi from '~/api/GroupApi';
import { ICommunityMemberState } from '../index';

const approveSingleCommunityMemberRequest = (get) => async (
  payload: IPayloadApproveSingleCommunityMemberRequest,
) => {
  const {
    communityId, groupId, requestId,
  } = payload || {};
  const { actions: communitiesActions } = useCommunitiesStore.getState();
  const { communityMemberRequests, actions }: ICommunityMemberState = get();
  const { total, ids, items } = communityMemberRequests || {};

  try {
    if (!groupId || !requestId) return;

    const response = await groupApi.approveSingleGroupMemberRequest(groupId, requestId);

    // Update data state
    const requestItems = { ...items };
    delete requestItems[requestId];
    actions.setCommunityMemberRequests({
      total: total - 1,
      ids: ids.filter((item: string) => item !== requestId),
      items: requestItems,
    });

    showToastSuccess(response);
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
