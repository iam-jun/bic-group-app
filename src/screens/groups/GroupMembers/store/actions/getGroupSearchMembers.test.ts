import groupApi from '~/api/GroupApi';
import { memberData } from '~/test/mock_data/group';
import { act, renderHook } from '~/test/testUtils';
import useGroupMemberStore from '../index';

describe('getGroupSearchMembers', () => {
  const groupId = 'de605abc-15d4-4828-9494-aaedd9565850';

  it('should search group members success:', () => {
    const response = {
      code: 'api.ok',
      data: memberData,
      meta: {
        hasNextPage: false,
        limit: 25,
        message: 'Success',
        offset: 0,
        total: 7,
      },
    };
    const spy = jest
      .spyOn(groupApi, 'getGroupMembers')
      .mockImplementation(() => Promise.resolve(response) as any);

    jest.useFakeTimers();

    const { result } = renderHook(() => useGroupMemberStore((state) => state));
    act(() => {
      result.current.actions.getGroupSearchMembers({ groupId, params: { key: 'k' } });
    });

    expect(result.current.search.loading).toBe(true);
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.search.loading).toBe(false);
    expect(result.current.search.canLoadMore).toBe(false);
    expect(result.current.search.data.length).toEqual(
      memberData.groupAdmin.data.length + memberData.groupMember.data.length,
    );
  });
});
