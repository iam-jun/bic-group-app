import { act, renderHook } from '~/test/testUtils';
import groupApi from '~/api/GroupApi';
import useCommunityMemberStore from '../index';
import { IPayloadApproveAllCommunityMemberRequest } from '~/interfaces/ICommunity';
import * as showToastError from '~/store/helper/showToastError';
import * as showToastSuccess from '~/store/helper/showToastSuccess';

describe('approveAllCommunityMemberRequests', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const payload = {
    communityId: 'e2487d02-b7be-4185-8245-f7596eba1437',
    groupId: 'e2487d02-b7be-4185-8245-f7596eba1437',
    total: 10,
  };

  it('should call api approveAllGroupMemberRequests throw error', () => {
    const error = { code: 'error' };
    const spy = jest.spyOn(groupApi, 'approveAllGroupMemberRequests').mockImplementation(
      () => Promise.reject(error) as any,
    );
    const spyShowToastError = jest.spyOn(showToastError, 'default');

    jest.useFakeTimers();

    const { result } = renderHook(() => useCommunityMemberStore((state) => state));

    act(() => {
      try {
        result.current.actions.approveAllCommunityMemberRequests(payload);
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

  it('should not call api approveAllGroupMemberRequests when payload of action is empty', () => {
    const spy = jest.spyOn(groupApi, 'approveAllGroupMemberRequests').mockImplementation(
      () => Promise.resolve({}) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useCommunityMemberStore((state) => state));

    act(() => {
      result.current.actions.approveAllCommunityMemberRequests(
                {} as IPayloadApproveAllCommunityMemberRequest,
      );
    });

    expect(spy).not.toBeCalled();
    act(() => {
      jest.runAllTimers();
    });
  });

  it('should call api approveAllGroupMemberRequests success', () => {
    const response = {
      code: 'ok',
      data: true,
      meta: {
        message: 'Success',
      },
    };
    const spy = jest.spyOn(groupApi, 'approveAllGroupMemberRequests').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const spyShowToastSuccess = jest.spyOn(showToastSuccess, 'default');

    jest.useFakeTimers();

    const { result } = renderHook(() => useCommunityMemberStore((state) => state));

    act(() => {
      result.current.actions.approveAllCommunityMemberRequests(payload);
    });
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyShowToastSuccess).toBeCalled();
  });
});
