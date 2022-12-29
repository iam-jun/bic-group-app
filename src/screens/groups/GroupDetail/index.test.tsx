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

describe('GroupDetail component', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const component = () => (
    <GroupDetail route={{ params: { groupId: groupDetailData.group.id } }} />
  );

  it('renders Placeholder  correctly', () => {
    const { getByTestId } = renderWithRedux(<MockedNavigator component={component} />);
    const placeholder = getByTestId('group_detail.placeholder');
    expect(placeholder).toBeDefined();
  });

  it('renders GroupPrivateWelcome when user is a visitor to a private group', () => {
    jest.useFakeTimers();
    act(() => {
      useGroupDetailStore.setState({
        groupDetail: {
          ...groupDetailData,
          joinStatus: GroupJoinStatus.VISITOR,
          group: { ...groupDetailData.group, privacy: GroupPrivacyType.PRIVATE },
        },
      });
    });
    act(() => {
      jest.runAllTimers();
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
