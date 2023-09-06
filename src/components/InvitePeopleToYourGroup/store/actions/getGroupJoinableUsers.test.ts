import groupApi from '~/api/GroupApi';
import useModalStore from '~/store/modal';
import {
  joinableUsersData, user1, user2, user3,
} from '~/test/mock_data/joinableUsers';
import { act, renderHook } from '~/test/testUtils';
import useGroupJoinableUsersStore from '../index';

describe('getGroupJoinableUsers', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const groupId = 'test-group-id';
  const key = 'search text';

  it('should search users success: isLoadMore = false', () => {
    const response = {
      data: joinableUsersData,
      meta: {
        hasNextPage: false,
      },
    };

    useGroupJoinableUsersStore.setState((state) => {
      state.data = {
        'user-1': user1,
      };
      state.users = {
        ids: ['user-1'],
        loading: false,
        hasNextPage: false,
      };
      state.selectedUsers = [];
      return state;
    });

    const spy = jest.spyOn(groupApi, 'getJoinableUsers').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useGroupJoinableUsersStore((state) => state));
    act(() => {
      result.current.actions.getGroupJoinableUsers({ groupId, key, isLoadMore: false });
    });
    expect(spy).toBeCalled();
    expect(result.current.users.ids).toEqual([]);
    expect(result.current.users.loading).toEqual(true);
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.data).toEqual({
      'user-1': user1,
      'user-2': user2,
      'user-3': user3,
    });
    expect(result.current.users.loading).toEqual(false);
    expect(result.current.users.ids).toEqual(['user-1', 'user-2', 'user-3']);
    expect(result.current.users.hasNextPage).toEqual(response.meta.hasNextPage);
  });

  it('should load more data success: isLoadMore = true & hasNextPage = true', () => {
    const response = {
      data: [user2, user3],
      meta: {
        hasNextPage: false,
      },
    };

    useGroupJoinableUsersStore.setState((state) => {
      state.data = {
        'user-1': user1,
      };
      state.users = {
        ids: ['user-1'],
        loading: false,
        hasNextPage: true,
      };
      state.selectedUsers = [];
      return state;
    });

    const spy = jest.spyOn(groupApi, 'getJoinableUsers').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useGroupJoinableUsersStore((state) => state));
    act(() => {
      result.current.actions.getGroupJoinableUsers({ groupId, key, isLoadMore: true });
    });
    expect(spy).toBeCalled();
    expect(result.current.users.ids).toEqual(['user-1']);
    expect(result.current.data).toEqual({
      'user-1': user1,
    });
    expect(result.current.users.loading).toEqual(false);
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.data).toEqual({
      'user-1': user1,
      'user-2': user2,
      'user-3': user3,
    });
    expect(result.current.users.loading).toEqual(false);
    expect(result.current.users.ids).toEqual(['user-1', 'user-2', 'user-3']);
    expect(result.current.users.hasNextPage).toEqual(response.meta.hasNextPage);
  });

  it('should call API when isLoadMore = true and hasNextPage = false', () => {
    const response = {};

    useGroupJoinableUsersStore.setState((state) => {
      state.data = {
        'user-1': user1,
      };
      state.users = {
        ids: ['user-1'],
        loading: false,
        hasNextPage: false,
      };
      state.selectedUsers = [];
      return state;
    });

    const spy = jest.spyOn(groupApi, 'getJoinableUsers').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useGroupJoinableUsersStore((state) => state));
    act(() => {
      result.current.actions.getGroupJoinableUsers({ groupId, key, isLoadMore: true });
    });
    expect(spy).not.toBeCalled();
    act(() => {
      jest.runAllTimers();
    });
  });

  it('should call API and throws an error', () => {
    const error = {
      meta: {
        message: 'This is error message',
      },
    };

    const spy = jest.spyOn(groupApi, 'getJoinableUsers').mockImplementation(
      () => Promise.reject(error),
    );

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useGroupJoinableUsersStore((state) => state));

    act(() => {
      try {
        result.current.actions.getGroupJoinableUsers({ groupId, key, isLoadMore: false });
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.users.loading).toEqual(false);
    expect(showToast).toBeCalledWith({
      content: 'This is error message',
      type: 'error',
    });
  });
});
