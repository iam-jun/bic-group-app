import i18next from 'i18next';
import { act, renderHook } from '~/test/testUtils';
import groupApi from '~/api/GroupApi';
import useCommunityMemberStore from '../index';
import { IPayloadApproveSingleCommunityMemberRequest } from '~/interfaces/ICommunity';
import modalActions from '~/storeRedux/modal/actions';

describe('approveSingleCommunityMemberRequest', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const payload = {
    communityId: 'e2487d02-b7be-4185-8245-f7596eba1437',
    groupId: 'e2487d02-b7be-4185-8245-f7596eba1437',
    requestId: '581b0f5d-c506-4216-a378-3267d1e24a1f',
    fullName: 'Nguyen Van A',
  };

  it('should call api approveSingleGroupMemberRequest throw error', () => {
    const error = { code: 'error' };
    const spy = jest.spyOn(groupApi, 'approveSingleGroupMemberRequest').mockImplementation(
      () => Promise.reject(error) as any,
    );
    const spyModalActions = jest.spyOn(modalActions, 'showHideToastMessage');

    jest.useFakeTimers();

    const { result } = renderHook(() => useCommunityMemberStore((state) => state));

    act(() => {
      try {
        result.current.actions.approveSingleCommunityMemberRequest(payload);
      } catch (error) {
        expect(error).toBeInstanceOf(TypeError);
        expect(error).toBe(error);
      }
    });
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyModalActions).toBeCalledWith({
      content: 'common:text_error_message',
      props: {
        type: 'error',
      },
    });
  });

  it('should not call api approveSingleGroupMemberRequest when payload of action is empty', () => {
    const spy = jest.spyOn(groupApi, 'approveSingleGroupMemberRequest').mockImplementation(
      () => Promise.resolve({}) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useCommunityMemberStore((state) => state));

    act(() => {
      result.current.actions.approveSingleCommunityMemberRequest(
                {} as IPayloadApproveSingleCommunityMemberRequest,
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
    const spyModalActions = jest.spyOn(modalActions, 'showHideToastMessage');

    jest.useFakeTimers();

    const { result } = renderHook(() => useCommunityMemberStore((state) => state));

    act(() => {
      result.current.actions.approveSingleCommunityMemberRequest(payload);
    });
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyModalActions).toBeCalledWith({
      content: `${i18next.t('groups:text_approved_user')} ${payload.fullName}`,
    });
  });
});
