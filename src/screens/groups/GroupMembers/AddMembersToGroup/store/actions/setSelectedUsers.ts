import { IGroupJoinableUsersState } from '..';

const setSelectedUsers = (set, get) => (userId: string) => {
  const { selectedUsers }: IGroupJoinableUsersState = get();
  const isSelected = selectedUsers.includes(userId);
  const newSelectedUsers = isSelected
    ? selectedUsers.filter((item) => item !== userId)
    : selectedUsers.concat(userId);

  set((state: IGroupJoinableUsersState) => {
    state.selectedUsers = newSelectedUsers;
  }, 'setSelectedUsers');
};

export default setSelectedUsers;
