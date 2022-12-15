import groupApi from '~/api/GroupApi';
import modalActions from '~/storeRedux/modal/actions';
import { memberData } from '~/test/mock_data/group';
import { act, renderHook } from '~/test/testUtils';
import useGroupMemberStore from '../index';

describe('getGroupMembers', () => {
  const groupId = 'de605abc-15d4-4828-9494-aaedd9565850';

  it('should get group members success:', () => {
    const response = {
      code: 'OK',
      data: memberData,
      meta: {
        hasNextPage: false, limit: 25, message: 'Success', offset: 0, total: 7,
      },
    };

    const spy = jest.spyOn(groupApi, 'getGroupMembers').mockImplementation(() => Promise.resolve(response) as any);

    jest.useFakeTimers();
    const { result } = renderHook(() => useGroupMemberStore((state) => state));
    act(() => {
      result.current.actions.getGroupMembers({ groupId });
    });
    expect(result.current.groupMembers.loading).toBe(true);
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.groupMembers.loading).toBe(false);
    expect(result.current.groupMembers.canLoadMore).toBe(response.meta.hasNextPage);
    expect(result.current.groupMembers.offset).toEqual(response.meta.total);
  });

  it('should get group members throw error', () => {
    const error = 'internal error';

    const spy = jest.spyOn(groupApi, 'getGroupMembers').mockImplementation(() => Promise.reject(error) as any);

    const spyModalActions = jest.spyOn(
      modalActions,
      'showHideToastMessage',
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useGroupMemberStore((state) => state));
    act(() => {
      try {
        result.current.actions.getGroupMembers({ groupId });
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.groupMembers.loading).toBe(false);
    expect(spyModalActions).toBeCalled();
  });
});
