import { cleanup } from '@testing-library/react-native';
import { getAllChildrenName, handleLeaveInnerGroups } from '.';
import groupApi from '../../../api/GroupApi';
import { GROUP_TREE } from '~/test/mock_data/group';

afterEach(cleanup);

describe('Group functions helper', () => {
  const mainCallback = jest.fn();

  it('handleLeaveInnerGroups should call prop callback correctly', async () => {
    jest.spyOn(groupApi, 'getUserInnerGroups').mockImplementation(() => Promise.resolve({
      data: {
        current_group: {},
        inner_groups: [{ userId: 'test' }],
      },
    }));
    const result = await handleLeaveInnerGroups(
      '1',
      'userId',
      mainCallback,
    );
    expect(result).toBeTruthy();
  });

  it('handleLeaveInnerGroups should show error message from server', async () => {
    const error = 'internal error';
    jest
      .spyOn(groupApi, 'getUserInnerGroups')
      .mockImplementation(() => Promise.reject(error) as any);
    const result = await handleLeaveInnerGroups(
      '1',
      'userId',
      mainCallback,
    );
    expect(result).toBeFalsy();
  });

  it('getAllChildrenName should return name of 3 level', () => {
    const group: any = GROUP_TREE;
    const result = getAllChildrenName(group);
    expect(result).toStrictEqual([
      GROUP_TREE.children[0].name,
      GROUP_TREE.children[0].children[0].name,
    ]);
  });

  it('getAllChildrenName should return name of group has no child', () => {
    const group: any = { ...GROUP_TREE, children: [] };
    const result = getAllChildrenName(group);
    expect(result).toStrictEqual([]);
  });
});
