import { IPayloadApproveAllGroupMemberRequests } from '~/interfaces/IGroup';
import useGroupDetailStore from '~/screens/groups/GroupDetail/store';
import showToastError from '~/store/helper/showToastError';
import groupApi from '~/api/GroupApi';
import { IGroupMemberState } from '..';
import showToastSuccess from '~/store/helper/showToastSuccess';

const approveAllGroupMemberRequests = (get) => async (
  payload: IPayloadApproveAllGroupMemberRequests,
) => {
  const { groupId } = payload || {};
  const { actions }: IGroupMemberState = get();

  try {
    if (!groupId) return;

    actions.resetGroupMemberRequests();

    // to show Empty screen component
    actions.setGroupMemberRequests({ loading: false });

    const response = await groupApi.approveAllGroupMemberRequests(groupId);

    // to update userCount
    useGroupDetailStore.getState().actions.getGroupDetail({ groupId });

    showToastSuccess(response);
  } catch (e) {
    console.error('approveAllGroupMemberRequests: ', e);
    showToastError(e);
  }
};

export default approveAllGroupMemberRequests;
