import groupApi from '~/api/GroupApi';
import { act, renderHook } from '~/test/testUtils';
import useGroupJoinableUsersStore from '../index';
import { responseGetInvitations } from '~/test/mock_data/invitedPeople';
import * as showToastError from '~/store/helper/showToastError';

describe('getInvitations', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const groupId = 'test';
  const isRefreshing = false;

  it('should getInvitations success: isRefreshing = false', () => {
    const spy = jest
      .spyOn(groupApi, 'getInvitations')
      .mockImplementation(() => Promise.resolve(responseGetInvitations));

    jest.useFakeTimers();
    const { result } = renderHook(() => useGroupJoinableUsersStore((state) => state));
    act(() => {
      result.current.actions.getInvitations(groupId, isRefreshing);
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.invitedPeople.data.length).toEqual(responseGetInvitations.data.length);
  });

  it('should getInvitations throws an error', () => {
    const error = 'error';

    const spy = jest.spyOn(groupApi, 'getInvitations').mockImplementation(() => Promise.reject(error));

    const spyShowToastError = jest.spyOn(showToastError, 'default');

    jest.useFakeTimers();
    const { result } = renderHook(() => useGroupJoinableUsersStore((state) => state));

    act(() => {
      try {
        result.current.actions.getInvitations(groupId, isRefreshing);
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
