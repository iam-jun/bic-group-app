import groupApi from '~/api/GroupApi';
import { IPayloadDeclineAllCommunityMemberRequests } from '~/interfaces/ICommunity';
import { ICommunityMemberState } from '../index';
import showToastSuccess from '~/store/helper/showToastSuccess';
import showToastError from '~/store/helper/showToastError';

const declineAllCommunityMemberRequests = (get) => async (
  payload: IPayloadDeclineAllCommunityMemberRequests,
) => {
  const { groupId } = payload || {};
  const { actions }: ICommunityMemberState = get();

  try {
    if (!groupId) return;

    const response = await groupApi.declineAllGroupMemberRequests(groupId);
    actions.resetUndoCommunityMemberRequests();

    showToastSuccess(response);
  } catch (e) {
    console.error('declineAllCommunityMemberRequests: ', e);
    showToastError(e);
  }
};

export default declineAllCommunityMemberRequests;
