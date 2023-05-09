import { act, renderHook } from '~/test/testUtils';
import groupApi from '~/api/GroupApi';
import useGroupMemberStore from '../index';
import { IPayloadApproveSingleGroupMemberRequest } from '~/interfaces/IGroup';
import * as showToastError from '~/store/helper/showToastError';
import * as showToastSuccess from '~/store/helper/showToastSuccess';

describe('action approveSingleGroupMemberRequest', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const payload = {
    groupId: 'e2487d02-b7be-4185-8245-f7596eba1437',
    requestId: '581b0f5d-c506-4216-a378-3267d1e24a1f',
    fullName: 'Nguyen Van A',
  };

  it('should call api approveSingleGroupMemberRequest throw error', () => {
    const error = { code: 'error' };
    const spy = jest.spyOn(groupApi, 'approveSingleGroupMemberRequest').mockImplementation(
      () => Promise.reject(error) as any,
    );
    const spyShowToastError = jest.spyOn(showToastError, 'default');

    jest.useFakeTimers();

    const { result } = renderHook(() => useGroupMemberStore((state) => state));

    act(() => {
      try {
        result.current.actions.approveSingleGroupMemberRequest(payload);
      } catch (error) {
        expect(error).toBeInstanceOf(TypeError);
        expect(error).toBe(error);
      }
    });
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyShowToastError).toBeCalled();
  });

  it('should not call api approveSingleGroupMemberRequest when payload of action is empty', () => {
    const spy = jest.spyOn(groupApi, 'approveSingleGroupMemberRequest').mockImplementation(
      () => Promise.resolve({}) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useGroupMemberStore((state) => state));

    act(() => {
      result.current.actions.approveSingleGroupMemberRequest(
                    {} as IPayloadApproveSingleGroupMemberRequest,
      );
    });

    expect(spy).not.toBeCalled();
    act(() => {
      jest.runAllTimers();
    });
  });

  it('should call api approveSingleGroupMemberRequest success', () => {
    const response = {
      code: 'ok',
      data: true,
      meta: {
        message: 'Success',
      },
    };
    const spy = jest.spyOn(groupApi, 'approveSingleGroupMemberRequest').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    const spyShowToastSuccess = jest.spyOn(showToastSuccess, 'default');

    jest.useFakeTimers();

    const { result } = renderHook(() => useGroupMemberStore((state) => state));

    act(() => {
      result.current.actions.approveSingleGroupMemberRequest(payload);
    });
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyShowToastSuccess).toBeCalled();
  });
});
