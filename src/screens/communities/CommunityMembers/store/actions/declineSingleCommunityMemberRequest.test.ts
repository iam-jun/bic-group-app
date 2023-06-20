import { act, renderHook } from '~/test/testUtils';
import groupApi from '~/api/GroupApi';
import useCommunityMemberStore from '../index';
import { IPayloadDeclineSingleCommunityMemberRequest } from '~/interfaces/ICommunity';
import * as showToastError from '~/store/helper/showToastError';
import * as showToastSuccess from '~/store/helper/showToastSuccess';

describe('declineSingleCommunityMemberRequest', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const payload = {
    groupId: 'e2487d02-b7be-4185-8245-f7596eba1437',
    requestId: '581b0f5d-c506-4216-a378-3267d1e24a1f',
    fullName: 'Nguyen Van A',
  };

  it('should call api declineSingleGroupMemberRequest throw error', () => {
    const error = { code: 'error' };
    const spy = jest.spyOn(groupApi, 'declineSingleGroupMemberRequest').mockImplementation(
      () => Promise.reject(error) as any,
    );
    const spyShowToastError = jest.spyOn(showToastError, 'default');

    jest.useFakeTimers();

    const { result } = renderHook(() => useCommunityMemberStore((state) => state));

    act(() => {
      try {
        result.current.actions.declineSingleCommunityMemberRequest(payload);
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

  it('should not call api declineSingleGroupMemberRequest when payload of action is empty', () => {
    const spy = jest.spyOn(groupApi, 'declineSingleGroupMemberRequest').mockImplementation(
      () => Promise.resolve({}) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useCommunityMemberStore((state) => state));

    act(() => {
      result.current.actions.declineSingleCommunityMemberRequest(
                {} as IPayloadDeclineSingleCommunityMemberRequest,
      );
    });

    expect(spy).not.toBeCalled();
    act(() => {
      jest.runAllTimers();
    });
  });

  it('should call api declineSingleGroupMemberRequest success', () => {
    const response = {
      code: 'ok',
      data: true,
      meta: {
        message: 'Success',
      },
    };
    const spy = jest.spyOn(groupApi, 'declineSingleGroupMemberRequest').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    const spyShowToastSuccess = jest.spyOn(showToastSuccess, 'default');

    jest.useFakeTimers();

    const { result } = renderHook(() => useCommunityMemberStore((state) => state));

    act(() => {
      result.current.actions.declineSingleCommunityMemberRequest(payload);
    });
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyShowToastSuccess).toBeCalled();
  });
});
