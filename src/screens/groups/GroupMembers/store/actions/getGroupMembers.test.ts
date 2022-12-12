import groupApi from '~/api/GroupApi';
import { act, renderHook } from '~/test/testUtils';
import useGroupMemberStore from '..';

describe('getGroupMembers', () => {
  const groupId = 'de605abc-15d4-4828-9494-aaedd9565850';

  it('should get group members success:', () => {
    const response = {
      code: 200,
      data: {},
      meta: {},
    };

    const spy = jest
      .spyOn(groupApi, 'getGroupMembers')
      .mockImplementation(() => Promise.resolve(response) as any);

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
  });

  it('should get group members throw error', () => {
    const error = 'internal error';

    const spy = jest
      .spyOn(groupApi, 'getGroupMembers')
      .mockImplementation(() => Promise.reject(error) as any);

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
  });
});
