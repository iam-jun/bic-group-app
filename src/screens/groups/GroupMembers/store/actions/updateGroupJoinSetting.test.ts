import { act, renderHook } from '~/test/testUtils';
import groupApi from '~/api/GroupApi';
import useGroupMemberStore from '../index';
import modalActions from '~/storeRedux/modal/actions';

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

    const spyModalActions = jest.spyOn(modalActions, 'showHideToastMessage');

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
    expect(spyModalActions).toBeCalledWith({
      content: error.meta.message,
      props: { type: 'error' },
    });
  });
});
