import groupApi from '~/api/GroupApi';
import useGroupDetailStore from '~/screens/groups/GroupDetail/store';
import showToastError from '~/store/helper/showToastError';
import showToastSuccess from '~/store/helper/showToastSuccess';
import { IGroupJoinableUsersState } from '..';
import useGroupMemberStore from '../../../store';

const addUsersToGroup = (set, get) => async (groupId: string) => {
  try {
    const { users, selectedUsers }: IGroupJoinableUsersState = get();

    const response = await groupApi.addUsersToGroup(selectedUsers, groupId);

    // removed added users from current joinable user list
    const newUpdatedJoinableUsers = users.ids.filter((item) => !selectedUsers.includes(item));

    set((state: IGroupJoinableUsersState) => {
      state.users.ids = newUpdatedJoinableUsers;
      state.selectedUsers = [];
    }, 'updateJoinableUsers');

    showToastSuccess(response);

    // refresh member data
    useGroupMemberStore.getState().actions.getGroupMembers({ groupId, isRefreshing: true });
    useGroupDetailStore.getState().actions.getGroupDetail({ groupId });
  } catch (error) {
    console.error('AddUsersToGroup error:', error);
    showToastError(error);
  }
};
export default addUsersToGroup;
