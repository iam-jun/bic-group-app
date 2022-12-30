import groupApi from '~/api/GroupApi';
import useModalStore from '~/store/modal';
import { memberData } from '~/test/mock_data/group';
import { act, renderHook } from '~/test/testUtils';
import useCommunityMemberStore from '../index';

describe('getCommunityMembers', () => {
  const groupId = 'de605abc-15d4-4828-9494-aaedd9565850';

  it('should get group members success:', () => {
    const response = {
      code: 'OK',
      data: memberData,
      meta: {
        hasNextPage: false, limit: 25, message: 'Success', offset: 0, total: 7,
      },
    };

    const spy = jest.spyOn(groupApi, 'getGroupMembers').mockImplementation(() => Promise.resolve(response) as any);

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
    expect(result.current.communityMembers.canLoadMore).toBe(response.meta.hasNextPage);
    expect(result.current.communityMembers.offset).toEqual(response.meta.total);
  });

  it('should get group members throw error', () => {
    const error = 'internal error';

    const spy = jest.spyOn(groupApi, 'getGroupMembers').mockImplementation(() => Promise.reject(error) as any);

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useCommunityMemberStore((state) => state));
    act(() => {
      try {
        result.current.actions.getCommunityMembers(groupId, true);
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
    expect(showToast).toBeCalled();
  });
});
