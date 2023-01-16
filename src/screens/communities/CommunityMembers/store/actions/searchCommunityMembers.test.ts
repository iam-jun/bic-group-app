import groupApi from '~/api/GroupApi';
import useModalStore from '~/store/modal';
import { memberData } from '~/test/mock_data/group';
import { act, renderHook } from '~/test/testUtils';
import useCommunityMemberStore from '../index';

describe('searchCommunityMembers', () => {
  const groupId = 'de605abc-15d4-4828-9494-aaedd9565850';
  const key = 'test';

  it('should search community members success:', () => {
    const response = {
      code: 'OK',
      data: { ...memberData },
      meta: {
        hasNextPage: false, limit: 25, message: 'Success', offset: 0, total: 7,
      },
    };

    const spy = jest.spyOn(groupApi, 'getGroupMembers').mockImplementation(() => Promise.resolve(response) as any);

    jest.useFakeTimers();
    const { result } = renderHook(() => useCommunityMemberStore((state) => state));
    act(() => {
      result.current.actions.searchCommunityMembers({ key, groupId });
    });
    expect(result.current.search.loading).toBe(true);
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.search.loading).toBe(false);
    expect(result.current.search.canLoadMore).toBe(response.meta.hasNextPage);
    expect(result.current.search.data?.length).toEqual(response.meta.total);
  });

  it('should load more community members success:', () => {
    const response = {
      code: 'OK',
      data: { ...memberData },
      meta: {
        hasNextPage: false, limit: 25, message: 'Success', offset: 0, total: 7,
      },
    };

    const spy = jest.spyOn(groupApi, 'getGroupMembers').mockImplementation(() => Promise.resolve(response) as any);
    useCommunityMemberStore.setState((state) => {
      state.search.data = [1, 2];
      state.search.canLoadMore = true;
      return state;
    });
    jest.useFakeTimers();
    const { result } = renderHook(() => useCommunityMemberStore((state) => state));
    act(() => {
      result.current.actions.searchCommunityMembers({ key, groupId, isLoadMore: true });
    });
    expect(result.current.search.loading).toBe(false);
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.search.loading).toBe(false);
    expect(result.current.search.canLoadMore).toBe(response.meta.hasNextPage);
    expect(result.current.search.data?.length).toEqual(response.meta.total + 2);
  });

  it('should get community members throw error', () => {
    const error = 'internal error';

    const spy = jest.spyOn(groupApi, 'getGroupMembers').mockImplementation(() => Promise.reject(error) as any);

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useCommunityMemberStore((state) => state));
    act(() => {
      try {
        result.current.actions.searchCommunityMembers({ key, groupId, isLoadMore: true });
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });
    expect(result.current.search.loading).toBe(true);
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.search.loading).toBe(false);
    expect(showToast).toBeCalled();
  });
});
