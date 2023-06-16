import groupApi from '~/api/GroupApi';
import { act, renderHook } from '~/test/testUtils';
import useCommunityMemberStore from '../index';
import * as showToastError from '~/store/helper/showToastError';
import * as showToastSuccess from '~/store/helper/showToastSuccess';

describe('removeCommunityMember', () => {
  const communityId = 'de605abc-15d4-4828-9494-aaedd9565850';
  const groupId = 'de605abc-15d4-4828-9494-aaedd9565850';
  const userId = 'de605abc-15d4-4828-9494-aaedd9565850';

  it('should remove community member success:', () => {
    const response = {
      code: 'OK',
      data: true,
      meta: {
        message: 'Removed member from Batrider successfully',
      },
    };

    const spy = jest.spyOn(groupApi, 'removeGroupMembers').mockImplementation(() => Promise.resolve(response) as any);

    const spyGetCommunityDetail = jest.spyOn(groupApi, 'getCommunityDetail');

    const spyShowToastSuccess = jest.spyOn(showToastSuccess, 'default');

    jest.useFakeTimers();
    const { result } = renderHook(() => useCommunityMemberStore((state) => state));
    act(() => {
      result.current.actions.removeCommunityMember({ communityId, groupId, userId });
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(spyGetCommunityDetail).toBeCalledWith(communityId);
    expect(spyShowToastSuccess).toBeCalled();
  });

  it('should remove community member throw error', () => {
    const error = {
      code: 'group.remove_member.forbidden',
      data: null,
      meta: { message: 'Cannot remove. Lê Hoàng belongs to inner group(s) that you do not have admin permission' },
    };

    const spy = jest.spyOn(groupApi, 'removeGroupMembers').mockImplementation(() => Promise.reject(error) as any);

    const spyShowToastError = jest.spyOn(showToastError, 'default');

    jest.useFakeTimers();
    const { result } = renderHook(() => useCommunityMemberStore((state) => state));
    act(() => {
      try {
        result.current.actions.removeCommunityMember({ communityId, groupId, userId });
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(spyShowToastError).toBeCalled();
  });
});
