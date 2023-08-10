import groupApi from '~/api/GroupApi';
import { act, renderHook } from '~/test/testUtils';
import useGroupJoinableUsersStore from '../index';
import { InvitationsTargetType, IParamsInvitations } from '~/interfaces/IGroup';
import * as showToastError from '~/store/helper/showToastError';
import * as showToastSuccess from '~/store/helper/showToastSuccess';

describe('invitations', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const params: IParamsInvitations = {
    targetId: 'test',
    targetType: InvitationsTargetType.GROUP,
    inviteeIds: ['test'],
    onError: jest.fn(),
    onSuccess: jest.fn(),
  };

  it('should call api success', () => {
    const response = {
      meta: {
        message: 'Invited people successfully',
      },
    };

    const spyShowToastSuccess = jest.spyOn(showToastSuccess, 'default');

    const spy = jest.spyOn(groupApi, 'invitations').mockImplementation(() => Promise.resolve(response) as any);

    jest.useFakeTimers();
    const { result } = renderHook(() => useGroupJoinableUsersStore((state) => state));
    act(() => {
      result.current.actions.invitations(params);
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(spyShowToastSuccess).toBeCalled();
  });

  it('should call API and throws an error', () => {
    const error = {
      meta: {
        message: 'This is error message',
      },
    };

    const spyShowToastError = jest.spyOn(showToastError, 'default');

    const spy = jest.spyOn(groupApi, 'invitations').mockImplementation(() => Promise.reject(error));

    jest.useFakeTimers();
    const { result } = renderHook(() => useGroupJoinableUsersStore((state) => state));
    act(() => {
      try {
        result.current.actions.invitations(params);
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
