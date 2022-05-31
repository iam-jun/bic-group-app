import {cleanup} from '@testing-library/react-native';
import {checkLastAdmin} from '.';
import groupsDataHelper from './GroupsDataHelper';
import {handleLeaveInnerGroups} from '.';

afterEach(cleanup);

describe('Group functions helper', () => {
  const groupId = '1';
  const userId = 1;
  const dispatch = jest.fn();
  const mainCallback = jest.fn();
  const onPressRight = jest.fn();

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
      .mockImplementation(() => Promise.resolve([{id: groupId}]));
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

  it('handleLeaveInnerGroups should call prop callback correctly', async () => {
    jest.spyOn(groupsDataHelper, 'getUserInnerGroups').mockImplementation(() =>
      Promise.resolve({
        data: {
          current_group: {},
          inner_groups: [{name: 'group_1'}],
        },
      }),
    );
    const result = await handleLeaveInnerGroups(
      1,
      'username',
      dispatch,
      mainCallback,
    );
    expect(result).toBeTruthy();
  });

  it('handleLeaveInnerGroups should show error message from server', async () => {
    jest
      .spyOn(groupsDataHelper, 'getUserInnerGroups')
      .mockImplementation(() => Promise.reject());
    const result = await handleLeaveInnerGroups(
      1,
      'username',
      dispatch,
      mainCallback,
    );
    expect(result).toBeFalsy();
  });
});
