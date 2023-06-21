import useCommunitiesStore from '~/store/entities/communities';
import showToastSuccess from '~/store/helper/showToastSuccess';
import showToastError from '~/store/helper/showToastError';
import { ICommunityMemberState } from '../index';
import groupApi from '~/api/GroupApi';
import { IPayloadApproveAllCommunityMemberRequest } from '~/interfaces/ICommunity';

const approveAllCommunityMemberRequests = (get) => async (
  payload: IPayloadApproveAllCommunityMemberRequest,
) => {
  const { communityId, groupId } = payload || {};
  const { actions }: ICommunityMemberState = get();
  const { actions: communitiesActions } = useCommunitiesStore.getState();

  try {
    if (!groupId) return;

    actions.resetCommunityMemberRequests();
    // to show Empty screen component
    actions.setCommunityMemberRequests({ loading: false });

    const response = await groupApi.approveAllGroupMemberRequests(groupId);

    // to update userCount
    communitiesActions.getCommunity(communityId);

    showToastSuccess(response);
  } catch (e) {
    console.error('approveAllCommunityMemberRequest: ', e);
    showToastError(e);
  }
};

export default approveAllCommunityMemberRequests;
