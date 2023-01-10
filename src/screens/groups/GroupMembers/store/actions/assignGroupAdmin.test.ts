import groupApi from '~/api/GroupApi';
import { ToastType } from '~/baseComponents/Toast/BaseToast';
import useModalStore from '~/store/modal';
import { act, renderHook } from '~/test/testUtils';
import useGroupMemberStore from '../index';

describe('assignGroupAdmin', () => {
  const userIds = ['fedf1226-edb2-4517-a156-c77879c8a1be'];
  const groupId = '65ef1299-f7f2-439d-82f6-a242168ef974';

  it('should set group admin success:', () => {
    const response = {
      code: 200,
      data: {},
      meta: {},
    };
    const spy = jest.spyOn(groupApi, 'setGroupAdmin').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const spyGroupActions = jest
      .spyOn(groupApi, 'getGroupMembers')
      .mockImplementation(() => Promise.resolve(response) as any);

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useGroupMemberStore((state) => state));
    act(() => {
      result.current.actions.assignGroupAdmin(groupId, userIds);
    });

    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyGroupActions).toBeCalled();
    expect(showToast).toBeCalledWith({
      content: 'common:text_success_message',
      type: ToastType.SUCCESS,
    });
  });

  it('should set group admin throw error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(groupApi, 'setGroupAdmin').mockImplementation(
      () => Promise.reject(error) as any,
    );
    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useGroupMemberStore((state) => state));

    act(() => {
      try {
        result.current.actions.assignGroupAdmin(groupId, userIds);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
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
});
