import { act, renderHook } from '~/test/testUtils';
import groupApi from '~/api/GroupApi';
import useGroupMemberStore from '../index';
import useModalStore from '~/store/modal';
import { ToastType } from '~/baseComponents/Toast/BaseToast';

describe('updateGroupJoinSetting', () => {
  const groupId = '123';
  const isJoinApproval = false;
  it('should update group join setting successfully', () => {
    const spy = jest.spyOn(groupApi, 'updateGroupJoinSetting').mockImplementation(
      () => Promise.resolve({}) as any,
    );

    const spyApiGetGroupDetail = jest
      .spyOn(groupApi, 'getGroupDetail')
      .mockImplementation(() => Promise.resolve() as any);

    jest.useFakeTimers();
    const { result } = renderHook(() => useGroupMemberStore((state) => state));
    act(() => {
      result.current.actions.updateGroupJoinSetting({ groupId, isJoinApproval });
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });
    expect(spyApiGetGroupDetail).toBeCalled();
  });

  it('should call API and return error', () => {
    const error = {
      code: 'error',
      data: null,
      meta: { message: 'Some error' },
    };
    const spy = jest.spyOn(groupApi, 'updateGroupJoinSetting').mockImplementation(
      () => Promise.reject(error) as any,
    );

    const spyApiGetGroupDetail = jest
      .spyOn(groupApi, 'getGroupDetail')
      .mockImplementation(() => Promise.resolve() as any);

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useGroupMemberStore((state) => state));
    act(() => {
      result.current.actions.updateGroupJoinSetting({ groupId, isJoinApproval });
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });
    expect(spyApiGetGroupDetail).not.toBeCalled();
    expect(showToast).toBeCalledWith({
      content: error.meta.message,
      type: ToastType.ERROR,
    });
  });
});
