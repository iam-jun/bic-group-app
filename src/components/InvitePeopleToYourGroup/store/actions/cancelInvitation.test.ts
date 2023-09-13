import groupApi from '~/api/GroupApi';
import { act, renderHook } from '~/test/testUtils';
import useGroupJoinableUsersStore from '../index';
import { responseCancelInvitation } from '~/test/mock_data/invitedPeople';
import * as showToastError from '~/store/helper/showToastError';
import * as showToastSuccess from '~/store/helper/showToastSuccess';

describe('cancelInvitation', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const invitationId = 'test';

  it('should cancelInvitation success', () => {
    const spy = jest
      .spyOn(groupApi, 'cancelInvitation')
      .mockImplementation(() => Promise.resolve(responseCancelInvitation));

    const spyShowToastSuccess = jest.spyOn(showToastSuccess, 'default');

    jest.useFakeTimers();
    const { result } = renderHook(() => useGroupJoinableUsersStore((state) => state));
    act(() => {
      result.current.actions.cancelInvitation(invitationId);
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(spyShowToastSuccess).toBeCalled();
  });

  it('should cancelInvitation throws an error', () => {
    const error = 'error';

    const spy = jest.spyOn(groupApi, 'cancelInvitation').mockImplementation(() => Promise.reject(error));

    const spyShowToastError = jest.spyOn(showToastError, 'default');

    jest.useFakeTimers();
    const { result } = renderHook(() => useGroupJoinableUsersStore((state) => state));

    act(() => {
      try {
        result.current.actions.cancelInvitation(invitationId);
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
