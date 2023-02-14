import groupApi from '~/api/GroupApi';
import useModalStore from '~/store/modal';
import { memberData } from '~/test/mock_data/group';
import { act, renderHook } from '~/test/testUtils';
import useCommunityMemberStore, { ICommunityMemberState } from '../index';

describe('getCommunityMembers', () => {
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

    useCommunityMemberStore.setState((state: ICommunityMemberState) => {
      state.communityMembers = {
        loading: false,
        refreshing: false,
        canLoadMore: false,
        offset: 0,
      };
      return state;
    });

    jest.useFakeTimers();
    const { result } = renderHook(() => useCommunityMemberStore((state) => state));
    act(() => {
      result.current.actions.getCommunityMembers(groupId);
    });
    expect(result.current.communityMembers.loading).toBe(false);
    expect(result.current.communityMembers.refreshing).toBe(false);
    expect(spy).not.toBeCalled();
    act(() => {
      jest.runAllTimers();
    });
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

    useCommunityMemberStore.setState((state: ICommunityMemberState) => {
      state.communityMembers = {
        loading: false,
        refreshing: false,
        canLoadMore: true,
        offset: 0,
      };
      return state;
    });

    jest.useFakeTimers();
    const { result } = renderHook(() => useCommunityMemberStore((state) => state));
    act(() => {
      result.current.actions.getCommunityMembers(groupId);
    });
    expect(result.current.communityMembers.loading).toBe(true);
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.communityMembers.loading).toBe(false);
    expect(result.current.communityMembers.refreshing).toBe(false);
    expect(result.current.communityMembers.canLoadMore).toBe(response.meta.hasNextPage);
    expect(result.current.communityMembers.offset).toEqual(response.meta.total);
  });

  it('should refresh to get group members success:', () => {
    const response = {
      code: 'api.ok',
      data: memberData,
      meta: {
        hasNextPage: false, limit: 25, message: 'Success', offset: 0, total: 7,
      },
    };

    const spy = jest.spyOn(groupApi, 'getGroupMembers').mockImplementation(() => Promise.resolve(response) as any);

    useCommunityMemberStore.setState((state: ICommunityMemberState) => {
      state.communityMembers = {
        loading: false,
        refreshing: false,
        canLoadMore: true,
        offset: 0,
      };
      return state;
    });

    jest.useFakeTimers();
    const { result } = renderHook(() => useCommunityMemberStore((state) => state));
    act(() => {
      result.current.actions.getCommunityMembers(groupId, true);
    });
    expect(result.current.communityMembers.loading).toBe(false);
    expect(result.current.communityMembers.refreshing).toBe(true);
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.communityMembers.loading).toBe(false);
    expect(result.current.communityMembers.refreshing).toBe(false);
    expect(result.current.communityMembers.canLoadMore).toBe(response.meta.hasNextPage);
    expect(result.current.communityMembers.offset).toEqual(response.meta.total);
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
    const { result } = renderHook(() => useCommunityMemberStore((state) => state));
    act(() => {
      try {
        result.current.actions.getCommunityMembers(groupId);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });
    expect(result.current.communityMembers.loading).toBe(true);
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.communityMembers.loading).toBe(false);
    expect(result.current.communityMembers.refreshing).toBe(false);
    expect(showToast).toBeCalled();
  });
});
