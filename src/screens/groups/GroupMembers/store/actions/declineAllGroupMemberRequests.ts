import { IPayloadDeclineAllGroupMemberRequests } from '~/interfaces/IGroup';
import showToastError from '~/store/helper/showToastError';
import groupApi from '~/api/GroupApi';
import { IGroupMemberState } from '..';
import showToastSuccess from '~/store/helper/showToastSuccess';

export const declineAllGroupMemberRequests = (get) => async (
  payload: IPayloadDeclineAllGroupMemberRequests,
) => {
  const { groupId } = payload || {};
  const { actions }: IGroupMemberState = get();

  try {
    if (!groupId) return;

    const response = await groupApi.declineAllGroupMemberRequests(groupId);
    actions.resetUndoGroupMemberRequests();

    showToastSuccess(response);
  } catch (e) {
    console.error('declineAllGroupMemberRequests: ', e);
    showToastError(e);
  }
};

export default declineAllGroupMemberRequests;
