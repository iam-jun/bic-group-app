import useGroupJoinableUsersStore from '../index';
import { act, renderHook } from '~/test/testUtils';

describe('setSelectedUsers', () => {
  it('given user-1 is not selected yet, should add user-1 to the list', () => {
    useGroupJoinableUsersStore.setState((state) => {
      state.selectedUsers = [];
      return state;
    });

    const { result } = renderHook(() => useGroupJoinableUsersStore((state) => state));
    act(() => {
      result.current.actions.setSelectedUsers('user-1');
    });

    expect(result.current.selectedUsers).toEqual(['user-1']);
  });

  it('given user-1 is already selected, should remove user-1 from the list', () => {
    useGroupJoinableUsersStore.setState((state) => {
      state.selectedUsers = ['user-1', 'user-2'];
      return state;
    });

    const { result } = renderHook(() => useGroupJoinableUsersStore((state) => state));
    act(() => {
      result.current.actions.setSelectedUsers('user-1');
    });

    expect(result.current.selectedUsers).toEqual(['user-2']);
  });
});
