import { cleanup } from '@testing-library/react-native';
import { checkLastAdmin, getAllChildrenName, handleLeaveInnerGroups } from '.';
import groupApi from '../../../api/GroupApi';
import { GROUP_TREE } from '~/test/mock_data/group';

afterEach(cleanup);

describe('Group functions helper', () => {
  const groupId = '"1"';
  const userId = '1';
  const dispatch = jest.fn();
  const mainCallback = jest.fn();
  const onPressRight = jest.fn();

  it('checkLastAdmin: should call mainCallback correctly', async () => {
    jest
      .spyOn(groupApi, 'getInnerGroupsLastAdmin')
      .mockImplementation(() => Promise.resolve(null));
    const result = await checkLastAdmin(
      groupId,
      userId,
      dispatch,
      mainCallback,
      onPressRight,
    );
    expect(result).toBe('1');
    expect(mainCallback).toBeCalled();
  });

  it('checkLastAdmin: should dispatch last admin of current group error correctly', async () => {
    jest
      .spyOn(groupApi, 'getInnerGroupsLastAdmin')
      .mockImplementation(() => Promise.resolve([{ id: groupId }]));
    const result = await checkLastAdmin(
      groupId,
      userId,
      dispatch,
      mainCallback,
      onPressRight,
    );
    expect(result).toBe(2);
    expect(mainCallback).not.toBeCalled();
  });

  it('checkLastAdmin: should dispatch last admin of an inner group error correctly', async () => {
    jest
      .spyOn(groupApi, 'getInnerGroupsLastAdmin')
      .mockImplementation(() => Promise.resolve([{ id: 2 }]));
    const result = await checkLastAdmin(
      groupId,
      userId,
      dispatch,
      mainCallback,
      onPressRight,
    );
    expect(result).toBe(3);
    expect(mainCallback).not.toBeCalled();
  });

  it('checkLastAdmin: should show server error message', async () => {
    jest
      .spyOn(groupApi, 'getInnerGroupsLastAdmin')
      .mockImplementation(() => Promise.reject());
    const result = await checkLastAdmin(
      groupId,
      userId,
      dispatch,
      mainCallback,
      onPressRight,
    );
    expect(result).toBe(-'1');
    expect(mainCallback).not.toBeCalled();
  });

  it('handleLeaveInnerGroups should call prop callback correctly', async () => {
    jest.spyOn(groupApi, 'getUserInnerGroups').mockImplementation(() => Promise.resolve({
      data: {
        current_group: {},
        inner_groups: [{ name: 'group_"1"' }],
      },
    }));
    const result = await handleLeaveInnerGroups(
      '1',
      'username',
      dispatch,
      mainCallback,
    );
    expect(result).toBeTruthy();
  });

  it('handleLeaveInnerGroups should show error message from server', async () => {
    jest
      .spyOn(groupApi, 'getUserInnerGroups')
      .mockImplementation(() => Promise.reject());
    const result = await handleLeaveInnerGroups(
      '1',
      'username',
      dispatch,
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
