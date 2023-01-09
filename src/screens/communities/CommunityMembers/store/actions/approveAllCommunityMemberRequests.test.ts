import i18next from 'i18next';
import { act, renderHook } from '~/test/testUtils';
import groupApi from '~/api/GroupApi';
import useCommunityMemberStore from '../index';
import { IPayloadApproveAllCommunityMemberRequest } from '~/interfaces/ICommunity';
import useModalStore from '~/store/modal';
import { ToastType } from '~/baseComponents/Toast/BaseToast';

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
    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

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

    expect(showToast).toBeCalledWith({
      content: 'common:text_error_message',
      type: ToastType.ERROR,
    });
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
    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();

    const { result } = renderHook(() => useCommunityMemberStore((state) => state));

    act(() => {
      result.current.actions.approveAllCommunityMemberRequests(payload);
    });
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(showToast).toBeCalledWith({
      content: `${i18next.t('groups:text_approved_all')}`.replace('{0}', payload.total.toString()),
    });
  });
});
