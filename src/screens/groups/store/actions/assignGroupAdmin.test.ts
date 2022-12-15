import groupApi from '~/api/GroupApi';
import modalActions from '~/storeRedux/modal/actions';
import { act, renderHook } from '~/test/testUtils';
import useGroupController from '../index';

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

    const spyModalActions = jest.spyOn(modalActions, 'showHideToastMessage');

    jest.useFakeTimers();
    const { result } = renderHook(() => useGroupController((state) => state));
    act(() => {
      result.current.actions.assignGroupAdmin(groupId, userIds);
    });

    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyGroupActions).toBeCalled();
    expect(spyModalActions).toBeCalledWith({ content: 'common:text_success_message', props: { type: 'success' } });
  });

  it('should set group admin throw error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(groupApi, 'setGroupAdmin').mockImplementation(
      () => Promise.reject(error) as any,
    );
    const spyModalActions = jest.spyOn(modalActions, 'showHideToastMessage');

    jest.useFakeTimers();
    const { result } = renderHook(() => useGroupController((state) => state));

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

    expect(spyModalActions).toBeCalledWith({
      content: 'common:text_error_message',
      props: { type: 'error' },
    });
  });
});
