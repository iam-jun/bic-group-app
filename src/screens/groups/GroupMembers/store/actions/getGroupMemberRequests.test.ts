import { act, renderHook } from '~/test/testUtils';
import groupApi from '~/api/GroupApi';
import useGroupMemberStore, { IGroupMemberState } from '../index';
import { mapItems } from '~/screens/groups/helper/mapper';
import { IPayloadGetGroupMemberRequests } from '~/interfaces/IGroup';
import { memberRequestDetail } from '~/test/mock_data/communities';

describe('action getGroupMemberRequests', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const groupId = 'e2487d02-b7be-4185-8245-f7596eba1437';

  it('should call api getGroupMemberRequests when isRefreshing = true throw error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(groupApi, 'getGroupMemberRequests').mockImplementation(
      () => Promise.reject(error) as any,
    );

    useGroupMemberStore.setState((state: IGroupMemberState) => {
      state.groupMemberRequests.items = {} as any;
      state.groupMemberRequests.ids = [];
      state.groupMemberRequests.canLoadMore = true;
      return state;
    });

    jest.useFakeTimers();

    const { result } = renderHook(() => useGroupMemberStore((state) => state));

    act(() => {
      try {
        result.current.actions.getGroupMemberRequests({ groupId, isRefreshing: true });
      } catch (error) {
        expect(error).toBeInstanceOf(TypeError);
        expect(error).toBe(error);
      }
    });
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.groupMemberRequests.loading).toBe(false);
    expect(result.current.groupMemberRequests.total).toEqual(0);
    expect(result.current.groupMemberRequests.ids).toEqual([]);
    expect(result.current.groupMemberRequests.items).toEqual({});
  });

  it('should not call api getGroupMemberRequests when isRefreshing = false and canLoadMore = false', () => {
    const spy = jest.spyOn(groupApi, 'getGroupMemberRequests').mockImplementation(
      () => Promise.resolve({}) as any,
    );

    useGroupMemberStore.setState((state: IGroupMemberState) => {
      state.groupMemberRequests.ids = [];
      state.groupMemberRequests.items = {};
      state.groupMemberRequests.canLoadMore = false;
      state.groupMemberRequests.total = 0;
      return state;
    });

    jest.useFakeTimers();

    const { result } = renderHook(() => useGroupMemberStore((state) => state));

    act(() => {
      result.current.actions.getGroupMemberRequests({ groupId, isRefreshing: false });
    });

    expect(spy).not.toBeCalled();
    act(() => {
      jest.runAllTimers();
    });
  });

  it('should not call api getGroupMemberRequests when payload of action is empty', () => {
    const spy = jest.spyOn(groupApi, 'getGroupMemberRequests').mockImplementation(
      () => Promise.resolve({}) as any,
    );

    useGroupMemberStore.setState((state: IGroupMemberState) => {
      state.groupMemberRequests.ids = [];
      state.groupMemberRequests.items = {};
      state.groupMemberRequests.canLoadMore = false;
      state.groupMemberRequests.total = 0;
      return state;
    });

    jest.useFakeTimers();

    const { result } = renderHook(() => useGroupMemberStore((state) => state));

    act(() => {
      result.current.actions.getGroupMemberRequests({} as IPayloadGetGroupMemberRequests);
    });

    expect(spy).not.toBeCalled();
    act(() => {
      jest.runAllTimers();
    });
  });

  it('should call api getGroupMemberRequests when isRefreshing = true success', () => {
    const response = {
      data: [memberRequestDetail] as any,
      meta: {
        total: 1,
      },
      code: 'ok',
    };

    const spy = jest.spyOn(groupApi, 'getGroupMemberRequests').mockImplementation(
      () => Promise.resolve(response),
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useGroupMemberStore((state) => state));

    act(() => {
      result.current.actions.getGroupMemberRequests({ groupId, isRefreshing: true });
    });
    expect(result.current.groupMemberRequests.loading).toBe(true);
    expect(result.current.groupMemberRequests.total).toBe(0);
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.groupMemberRequests.items).toEqual(mapItems(response.data));
    expect(result.current.groupMemberRequests.ids).toEqual([response.data[0].id]);
    expect(result.current.groupMemberRequests.canLoadMore).toBe(false);
    expect(result.current.groupMemberRequests.loading).toBe(false);
    expect(result.current.groupMemberRequests.total).toBe(1);
  });

  it('should call api getGroupMemberRequests when isRefreshing = false success', () => {
    const response = {
      data: [memberRequestDetail] as any,
      meta: {
        total: 1,
      },
      code: 'ok',
    };

    const spy = jest.spyOn(groupApi, 'getGroupMemberRequests').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useGroupMemberStore((state) => state));

    act(() => {
      result.current.actions.getGroupMemberRequests({ groupId, isRefreshing: false });
    });
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.groupMemberRequests.items).toEqual(mapItems(response.data));
    expect(result.current.groupMemberRequests.ids).toEqual([response.data[0].id]);
    expect(result.current.groupMemberRequests.canLoadMore).toBe(false);
    expect(result.current.groupMemberRequests.loading).toBe(false);
    expect(result.current.groupMemberRequests.total).toBe(1);
  });
});
