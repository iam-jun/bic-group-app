import {cleanup} from '@testing-library/react-native';
import {useTheme} from 'react-native-paper';
import {ITheme} from '~/theme/interfaces';
import {checkLastAdmin, alertLeaveGroup} from '.';
import groupsDataHelper from './GroupsDataHelper';

afterEach(cleanup);

describe('Group functions helper', () => {
  const groupId = '1';
  const userId = 1;
  const dispatch = jest.fn();
  const mainCallback = jest.fn();
  const onPressRight = jest.fn();
  const theme = useTheme() as ITheme;
  const onConfirm = jest.fn();

  it('checkLastAdmin: should call mainCallback correctly', async () => {
    jest
      .spyOn(groupsDataHelper, 'getInnerGroupsLastAdmin')
      .mockImplementation(() => Promise.resolve(null));
    const result = await checkLastAdmin(
      groupId,
      userId,
      dispatch,
      mainCallback,
      onPressRight,
    );
    expect(result).toBe(1);
    expect(mainCallback).toBeCalled();
  });

  it('checkLastAdmin: should dispatch last admin of current group error correctly', async () => {
    jest
      .spyOn(groupsDataHelper, 'getInnerGroupsLastAdmin')
      .mockImplementation(() => Promise.resolve([{id: Number(groupId)}]));
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
      .spyOn(groupsDataHelper, 'getInnerGroupsLastAdmin')
      .mockImplementation(() => Promise.resolve([{id: 2}]));
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
      .spyOn(groupsDataHelper, 'getInnerGroupsLastAdmin')
      .mockImplementation(() => Promise.reject());
    const result = await checkLastAdmin(
      groupId,
      userId,
      dispatch,
      mainCallback,
      onPressRight,
    );
    expect(result).toBe(-1);
    expect(mainCallback).not.toBeCalled();
  });

  it('alertLeaveGroup: should leave group with no inner groups successfully', async () => {
    jest.spyOn(groupsDataHelper, 'getUserInnerGroups').mockImplementation(() =>
      Promise.resolve({
        data: {
          current_group: {},
          inner_groups: [],
        },
      }),
    );
    const result = await alertLeaveGroup(
      groupId,
      dispatch,
      'phuongkhanh',
      theme,
      onConfirm,
    );
    expect(result).toBe(0);
  });

  it('alertLeaveGroup: should leave group with at least 1 inner group successfully', async () => {
    jest.spyOn(groupsDataHelper, 'getUserInnerGroups').mockImplementation(() =>
      Promise.resolve({
        data: {
          current_group: {},
          inner_groups: [
            {name: 'group_1'},
            {name: 'group_2'},
            {name: 'group_3'},
          ],
        },
      }),
    );
    const result = await alertLeaveGroup(
      groupId,
      dispatch,
      'phuongkhanh',
      theme,
      onConfirm,
    );
    expect(result).toBe(3);
  });

  it('alertLeaveGroup: should show error message from server', async () => {
    jest
      .spyOn(groupsDataHelper, 'getUserInnerGroups')
      .mockImplementation(() => Promise.reject());
    const result = await alertLeaveGroup(
      groupId,
      dispatch,
      'phuongkhanh',
      theme,
      onConfirm,
    );
    expect(result).toBe(-1);
  });
});
