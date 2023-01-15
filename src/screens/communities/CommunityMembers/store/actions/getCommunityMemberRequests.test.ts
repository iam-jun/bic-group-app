import { act, renderHook } from '~/test/testUtils';
import groupApi from '~/api/GroupApi';
import useCommunityMemberStore, { ICommunityMemberState } from '../index';
import { memberRequestDetail } from '~/test/mock_data/communities';
import { mapItems } from '~/screens/groups/helper/mapper';
import { IPayloadGetCommunityMemberRequests } from '~/interfaces/ICommunity';

describe('getCommunityMemberRequests', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const groupId = 'e2487d02-b7be-4185-8245-f7596eba1437';

  it('should call api getCommunityMemberRequests when isRefreshing = true throw error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(groupApi, 'getGroupMemberRequests').mockImplementation(
      () => Promise.reject(error) as any,
    );

    useCommunityMemberStore.setState((state: ICommunityMemberState) => {
      state.communityMemberRequests.items = {} as any;
      state.communityMemberRequests.ids = [];
      state.communityMemberRequests.canLoadMore = true;
      return state;
    });

    jest.useFakeTimers();

    const { result } = renderHook(() => useCommunityMemberStore((state) => state));

    act(() => {
      try {
        result.current.actions.getCommunityMemberRequests({ groupId, isRefreshing: true });
      } catch (error) {
        expect(error).toBeInstanceOf(TypeError);
        expect(error).toBe(error);
      }
    });
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.communityMemberRequests.loading).toBe(false);
    expect(result.current.communityMemberRequests.total).toEqual(0);
    expect(result.current.communityMemberRequests.ids).toEqual([]);
    expect(result.current.communityMemberRequests.items).toEqual({});
  });

  it('should not call API when isRefreshing = false and canLoadMore = false', () => {
    const spy = jest.spyOn(groupApi, 'getGroupMemberRequests').mockImplementation(
      () => Promise.resolve({}) as any,
    );

    useCommunityMemberStore.setState((state: ICommunityMemberState) => {
      state.communityMemberRequests.ids = [];
      state.communityMemberRequests.items = {};
      state.communityMemberRequests.canLoadMore = false;
      state.communityMemberRequests.total = 0;
      return state;
    });

    jest.useFakeTimers();

    const { result } = renderHook(() => useCommunityMemberStore((state) => state));

    act(() => {
      result.current.actions.getCommunityMemberRequests({ groupId, isRefreshing: false });
    });

    expect(spy).not.toBeCalled();
    act(() => {
      jest.runAllTimers();
    });
  });

  it('should not call API when payload of action is empty', () => {
    const spy = jest.spyOn(groupApi, 'getGroupMemberRequests').mockImplementation(
      () => Promise.resolve({}) as any,
    );

    useCommunityMemberStore.setState((state: ICommunityMemberState) => {
      state.communityMemberRequests.ids = [];
      state.communityMemberRequests.items = {};
      state.communityMemberRequests.canLoadMore = false;
      state.communityMemberRequests.total = 0;
      return state;
    });

    jest.useFakeTimers();

    const { result } = renderHook(() => useCommunityMemberStore((state) => state));

    act(() => {
      result.current.actions.getCommunityMemberRequests({} as IPayloadGetCommunityMemberRequests);
    });

    expect(spy).not.toBeCalled();
    act(() => {
      jest.runAllTimers();
    });
  });

  it('should call API getCommunityMemberRequests when isRefreshing = true success', () => {
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

    const { result } = renderHook(() => useCommunityMemberStore((state) => state));

    act(() => {
      result.current.actions.getCommunityMemberRequests({ groupId, isRefreshing: true });
    });
    expect(result.current.communityMemberRequests.loading).toBe(true);
    expect(result.current.communityMemberRequests.total).toBe(0);
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.communityMemberRequests.items).toEqual(mapItems(response.data));
    expect(result.current.communityMemberRequests.ids).toEqual([response.data[0].id]);
    expect(result.current.communityMemberRequests.canLoadMore).toBe(false);
    expect(result.current.communityMemberRequests.loading).toBe(false);
    expect(result.current.communityMemberRequests.total).toBe(1);
  });

  it('should call API getCommunityMemberRequests when isRefreshing = false success', () => {
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

    const { result } = renderHook(() => useCommunityMemberStore((state) => state));

    act(() => {
      result.current.actions.getCommunityMemberRequests({ groupId, isRefreshing: false });
    });
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.communityMemberRequests.items).toEqual(mapItems(response.data));
    expect(result.current.communityMemberRequests.ids).toEqual([response.data[0].id]);
    expect(result.current.communityMemberRequests.canLoadMore).toBe(false);
    expect(result.current.communityMemberRequests.loading).toBe(false);
    expect(result.current.communityMemberRequests.total).toBe(1);
  });
});
