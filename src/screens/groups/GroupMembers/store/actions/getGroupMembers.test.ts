import groupApi from '~/api/GroupApi';
import useModalStore from '~/store/modal';
import { memberData } from '~/test/mock_data/group';
import { act, renderHook } from '~/test/testUtils';
import useGroupMemberStore, { IGroupMemberState } from '../index';

describe('getGroupMembers', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const groupId = 'de605abc-15d4-4828-9494-aaedd9565850';

  it('should return soon when there is no more data to fetch', () => {
    const response = {
      code: 'api.ok',
      data: [],
      meta: {},
    };

    const spy = jest.spyOn(groupApi, 'getGroupMembers').mockImplementation(() => Promise.resolve(response) as any);

    useGroupMemberStore.setState((state: IGroupMemberState) => {
      state.groupMembers = {
        loading: false,
        refreshing: false,
        canLoadMore: false,
        offset: 0,
      };
      return state;
    });

    jest.useFakeTimers();
    const { result } = renderHook(() => useGroupMemberStore((state) => state));
    act(() => {
      result.current.actions.getGroupMembers({ groupId });
    });
    expect(result.current.groupMembers.loading).toBe(false);
    expect(result.current.groupMembers.refreshing).toBe(false);
    expect(spy).not.toBeCalled();
    act(() => {
      jest.runAllTimers();
    });
  });

  it('should do nothing when refreshing data and there is no data return', () => {
    const response = {
      code: 'api.ok',
      meta: {},
    };

    const spy = jest.spyOn(groupApi, 'getGroupMembers').mockImplementation(() => Promise.resolve(response) as any);

    useGroupMemberStore.setState((state: IGroupMemberState) => {
      state.groupMembers = {
        loading: false,
        refreshing: false,
        canLoadMore: false,
        offset: 0,
      };
      return state;
    });

    jest.useFakeTimers();
    const { result } = renderHook(() => useGroupMemberStore((state) => state));
    act(() => {
      result.current.actions.getGroupMembers({ groupId, isRefreshing: true });
    });
    expect(result.current.groupMembers.loading).toBe(false);
    expect(result.current.groupMembers.refreshing).toBe(true);
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.groupMembers.loading).toBe(false);
    expect(result.current.groupMembers.refreshing).toBe(false);
    expect(result.current.groupMembers.canLoadMore).toBe(false);
    expect(result.current.groupMembers.offset).toEqual(0);
  });

  it('should get group members success:', () => {
    const response = {
      code: 'api.ok',
      data: memberData,
      meta: {
        hasNextPage: false, limit: 25, message: 'Success', offset: 0, total: 7,
      },
    };

    const spy = jest.spyOn(groupApi, 'getGroupMembers').mockImplementation(() => Promise.resolve(response) as any);

    useGroupMemberStore.setState((state: IGroupMemberState) => {
      state.groupMembers = {
        loading: false,
        refreshing: false,
        canLoadMore: true,
        offset: 0,
      };
      return state;
    });

    jest.useFakeTimers();
    const { result } = renderHook(() => useGroupMemberStore((state) => state));
    act(() => {
      result.current.actions.getGroupMembers({ groupId });
    });
    expect(result.current.groupMembers.loading).toBe(true);
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.groupMembers.loading).toBe(false);
    expect(result.current.groupMembers.refreshing).toBe(false);
    expect(result.current.groupMembers.canLoadMore).toBe(response.meta.hasNextPage);
    expect(result.current.groupMembers.offset).toEqual(response.meta.total);
  });

  it('should refresh get group members success:', () => {
    const response = {
      code: 'api.ok',
      data: memberData,
      meta: {
        hasNextPage: false, limit: 25, message: 'Success', offset: 0, total: 7,
      },
    };

    const spy = jest.spyOn(groupApi, 'getGroupMembers').mockImplementation(() => Promise.resolve(response) as any);

    useGroupMemberStore.setState((state: IGroupMemberState) => {
      state.groupMembers = {
        loading: false,
        refreshing: false,
        canLoadMore: true,
        offset: 0,
      };
      return state;
    });

    jest.useFakeTimers();
    const { result } = renderHook(() => useGroupMemberStore((state) => state));
    act(() => {
      result.current.actions.getGroupMembers({ groupId, isRefreshing: true });
    });
    expect(result.current.groupMembers.loading).toBe(false);
    expect(result.current.groupMembers.refreshing).toBe(true);
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.groupMembers.loading).toBe(false);
    expect(result.current.groupMembers.refreshing).toBe(false);
    expect(result.current.groupMembers.canLoadMore).toBe(response.meta.hasNextPage);
    expect(result.current.groupMembers.offset).toEqual(response.meta.total);
  });

  it('should get group members throw error', () => {
    const error = {
      meta: {
        message: 'This is error message',
      },
    };

    const spy = jest.spyOn(groupApi, 'getGroupMembers').mockImplementation(() => Promise.reject(error) as any);

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useGroupMemberStore((state) => state));
    act(() => {
      try {
        result.current.actions.getGroupMembers({ groupId });
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.groupMembers.loading).toBe(false);
    expect(result.current.groupMembers.refreshing).toBe(false);
    expect(showToast).toBeCalled();
  });
});
