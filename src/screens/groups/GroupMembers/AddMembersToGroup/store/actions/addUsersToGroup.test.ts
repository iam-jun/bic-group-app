import groupApi from '~/api/GroupApi';
import useGroupJoinableUsersStore from '../index';
import { act, renderHook } from '~/test/testUtils';
import useModalStore from '~/store/modal';

describe('addUsersToGroup', () => {
  const groupId = 'test-group-id';

  it('should add users to group success and then update store correctly', () => {
    const response = {
      meta: {
        message: 'Add successfully',
      },
    };

    useGroupJoinableUsersStore.setState((state) => {
      state.users = {
        ids: ['user-1', 'user-2', 'user-3'],
        loading: false,
        hasNextPage: false,
      };
      state.selectedUsers = ['user-1', 'user-3'];
      return state;
    });

    const spy = jest.spyOn(groupApi, 'addUsersToGroup').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useGroupJoinableUsersStore((state) => state));
    act(() => {
      result.current.actions.addUsersToGroup(groupId);
    });
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.users.ids).toEqual(['user-2']);
    expect(result.current.selectedUsers).toEqual([]);
    expect(showToast).toBeCalledWith({
      content: response.meta.message,
      type: 'success',
    });
  });

  it('should call API but thows an error', () => {
    const error = {
      meta: {
        message: 'This is error message',
      },
    };

    const spy = jest.spyOn(groupApi, 'addUsersToGroup').mockImplementation(
      () => Promise.reject(error) as any,
    );

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useGroupJoinableUsersStore((state) => state));

    act(() => {
      try {
        result.current.actions.addUsersToGroup(groupId);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(showToast).toBeCalledWith({
      content: 'This is error message',
      type: 'error',
    });
  });
});
