import { groupDetailData } from '~/test/mock_data/group';
import { act, renderHook } from '~/test/testUtils';
import useGroupsStore from '../index';

describe('addToGroups', () => {
  it('should add to groups success:', () => {
    const { result } = renderHook(() => useGroupsStore((state) => state));
    act(() => {
      result.current.actions.addToGroups(groupDetailData);
    });
    expect(result.current.groups[groupDetailData.group.id]).toBe(groupDetailData);
  });
});
