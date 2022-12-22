import groupApi from '~/api/GroupApi';
import groupsActions from '~/storeRedux/groups/actions';
import modalActions from '~/storeRedux/modal/actions';
import { act, renderHook } from '~/test/testUtils';
import useGroupMemberStore from '../index';

describe('removeGroupMember', () => {
  const groupId = 'de605abc-15d4-4828-9494-aaedd9565850';
  const userId = 'de605abc-15d4-4828-9494-aaedd9565850';

  it('should remove group member success:', () => {
    const response = {
      code: 'api.ok',
      data: true,
      meta: {
        message: 'Removed member from Batrider successfully',
      },
    };

    const spy = jest.spyOn(groupApi, 'removeGroupMembers').mockImplementation(() => Promise.resolve(response) as any);

    const spyGetGroupDetail = jest.spyOn(groupsActions, 'getGroupDetail');

    const spyModalActions = jest.spyOn(modalActions, 'showHideToastMessage');

    jest.useFakeTimers();
    const { result } = renderHook(() => useGroupMemberStore((state) => state));
    act(() => {
      result.current.actions.deleteRemoveGroupMember({ groupId, userId });
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(spyGetGroupDetail).toBeCalledWith({ groupId });
    expect(spyModalActions).toBeCalledWith({
      content: response.meta.message,
      props: { type: 'success' },
    });
  });

  it('should remove group member throw error', () => {
    const error = {
      code: 'group.remove_member.forbidden',
      data: null,
      meta: { message: 'Cannot remove. Lê Hoàng belongs to inner group(s) that you do not have admin permission' },
    };

    const spy = jest.spyOn(groupApi, 'removeGroupMembers').mockImplementation(() => Promise.reject(error) as any);

    const spyModalActions = jest.spyOn(modalActions, 'showHideToastMessage');

    jest.useFakeTimers();
    const { result } = renderHook(() => useGroupMemberStore((state) => state));
    act(() => {
      try {
        result.current.actions.deleteRemoveGroupMember({ groupId, userId });
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
      content: error.meta.message,
      props: { type: 'error' },
    });
  });
});
