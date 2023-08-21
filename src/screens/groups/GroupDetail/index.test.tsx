/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { act } from 'react-test-renderer';
import MockedNavigator from '~/test/MockedNavigator';
import { renderHook, renderWithRedux } from '~/test/testUtils';
import GroupDetail from '.';
import { groupDetailData } from '~/test/mock_data/group';
import { GroupPrivacyType } from '~/constants/privacyTypes';
import useGroupDetailStore from './store';
import GroupJoinStatus from '~/constants/GroupJoinStatus';
import useGroupsStore from '~/store/entities/groups';

describe('GroupDetail component', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const component = () => (
    <GroupDetail route={{ params: { groupId: groupDetailData.group.id } }} />
  );

  it('renders GroupPrivateWelcome when user is a visitor to a private group', () => {
    useGroupsStore.getState().actions.addToGroups({
      ...groupDetailData,
      joinStatus: GroupJoinStatus.VISITOR,
      group: { ...groupDetailData.group, privacy: GroupPrivacyType.PRIVATE },
    });

    const wrapper = renderWithRedux(<MockedNavigator component={component} />);
    const groupPrivateWelcome = wrapper.getByTestId('group_private_welcome');
    expect(groupPrivateWelcome).toBeDefined();
  });

  it('renders NoGroupFound when there is no group info', () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useGroupDetailStore((state) => state));
    act(() => {
      useGroupDetailStore.setState({
        isLoadingGroupDetailError: true,
      });
    });
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.isLoadingGroupDetailError).toEqual(true);
  });
});
