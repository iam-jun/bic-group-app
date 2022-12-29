import React from 'react';
import { act } from 'react-test-renderer';
import * as navigationHook from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';

import { renderWithRedux, fireEvent } from '~/test/testUtils';
import GroupContent from './GroupContent';
import { groupDetailData, groupPostData } from '~/test/mock_data/group';
import { GroupPrivacyType } from '~/constants/privacyTypes';
import { communityDetailData } from '~/test/mock_data/communities';
import useGroupDetailStore from '../store';
import GroupJoinStatus from '~/constants/GroupJoinStatus';

describe('GroupContent component', () => {
  const onScroll = jest.fn();
  const onGetInfoLayout = jest.fn();
  const community = { ...communityDetailData };

  it('renders Post button when user is a group member correctly', () => {
    jest.useFakeTimers();
    act(() => {
      useGroupDetailStore.setState({
        groupDetail: { ...groupDetailData },
      });
    });
    act(() => {
      jest.runAllTimers();
    });

    const { getByTestId } = renderWithRedux(
      <GroupContent community={community} onScroll={onScroll} onGetInfoLayout={onGetInfoLayout} />,
    );

    const postButton = getByTestId('group_content.post');
    expect(postButton).toBeDefined();
    fireEvent.press(postButton);
  });

  it('should not render Post button when user is not a group member correctly', () => {
    jest.useFakeTimers();
    act(() => {
      useGroupDetailStore.setState({
        groupDetail: { ...groupDetailData, joinStatus: GroupJoinStatus.VISITOR },
      });
    });
    act(() => {
      jest.runAllTimers();
    });

    const { queryByTestId } = renderWithRedux(
      <GroupContent community={community} onScroll={onScroll} onGetInfoLayout={onGetInfoLayout} />,
    );
    const postButton = queryByTestId('group_content.post');
    expect(postButton).toBeNull();
  });

  it('renders Channel button correctly', () => {
    jest.useFakeTimers();
    act(() => {
      useGroupDetailStore.setState({
        groupDetail: { ...groupDetailData },
      });
    });
    act(() => {
      jest.runAllTimers();
    });

    const { getByTestId } = renderWithRedux(
      <GroupContent community={community} onScroll={onScroll} onGetInfoLayout={onGetInfoLayout} />,
    );
    const channelButton = getByTestId('group_content.channel');
    expect(channelButton).toBeDefined();
  });

  it('renders About button correctly', () => {
    jest.useFakeTimers();
    act(() => {
      useGroupDetailStore.setState({
        groupDetail: { ...groupDetailData },
      });
    });
    act(() => {
      jest.runAllTimers();
    });

    const { getByTestId } = renderWithRedux(
      <GroupContent community={community} onScroll={onScroll} onGetInfoLayout={onGetInfoLayout} />,
    );
    const aboutButton = getByTestId('group_content.about');
    expect(aboutButton).toBeDefined();
  });

  it('renders Members button correctly when user is not a member but the group is public', () => {
    jest.useFakeTimers();
    act(() => {
      useGroupDetailStore.setState({
        groupDetail: { ...groupDetailData, joinStatus: GroupJoinStatus.VISITOR },
      });
    });
    act(() => {
      jest.runAllTimers();
    });

    const { getByTestId } = renderWithRedux(
      <GroupContent community={community} onScroll={onScroll} onGetInfoLayout={onGetInfoLayout} />,
    );
    const membersButton = getByTestId('group_content.members');
    expect(membersButton).toBeDefined();
  });

  it('should not render Members button correctly when user is not a member and the group is private', () => {
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

    const { queryByTestId } = renderWithRedux(
      <GroupContent community={community} onScroll={onScroll} onGetInfoLayout={onGetInfoLayout} />,
    );
    const membersButton = queryByTestId('group_content.members');
    expect(membersButton).toBeNull();
  });

  it('renders Files button correctly', () => {
    jest.useFakeTimers();
    act(() => {
      useGroupDetailStore.setState({
        groupDetail: { ...groupDetailData },
      });
    });
    act(() => {
      jest.runAllTimers();
    });

    const { getByTestId } = renderWithRedux(
      <GroupContent community={community} onScroll={onScroll} onGetInfoLayout={onGetInfoLayout} />,
    );
    const filesButton = getByTestId('group_content.files');
    expect(filesButton).toBeDefined();
  });

  it('should navigate to screen About when pressing About button', () => {
    jest.useFakeTimers();
    act(() => {
      useGroupDetailStore.setState({
        groupDetail: { ...groupDetailData },
      });
    });
    act(() => {
      jest.runAllTimers();
    });

    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));
    const { getByTestId } = renderWithRedux(
      <GroupContent community={community} onScroll={onScroll} onGetInfoLayout={onGetInfoLayout} />,
    );
    const btnAbout = getByTestId('group_content.about');
    fireEvent.press(btnAbout);
    expect(navigate).toBeCalledWith(groupStack.groupAbout, {
      groupId: groupDetailData.group.id,
    });
  });

  it('should navigate to screen Members when pressing Members button', () => {
    jest.useFakeTimers();
    act(() => {
      useGroupDetailStore.setState({
        groupDetail: { ...groupDetailData },
      });
    });
    act(() => {
      jest.runAllTimers();
    });

    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));
    const { getByTestId } = renderWithRedux(
      <GroupContent community={community} onScroll={onScroll} onGetInfoLayout={onGetInfoLayout} />,
    );
    const btnMembers = getByTestId('group_content.members');
    fireEvent.press(btnMembers);
    expect(navigate).toBeCalledWith(groupStack.groupMembers, {
      groupId: groupDetailData.group.id,
    });
  });

  it('should navigate to screen Files when pressing Files button', () => {
    jest.useFakeTimers();
    act(() => {
      useGroupDetailStore.setState({
        groupDetail: { ...groupDetailData },
      });
    });
    act(() => {
      jest.runAllTimers();
    });

    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));
    const { getByTestId } = renderWithRedux(
      <GroupContent community={community} onScroll={onScroll} onGetInfoLayout={onGetInfoLayout} />,
    );
    const btnFiles = getByTestId('group_content.files');
    fireEvent.press(btnFiles);
    expect(navigate).toBeCalledWith(groupStack.groupFiles, {
      groupId: groupDetailData.group.id,
    });
  });

  it('should navigate to screen Channel when pressing Channel button', () => {
    jest.useFakeTimers();
    act(() => {
      useGroupDetailStore.setState({
        groupDetail: { ...groupDetailData },
      });
    });
    act(() => {
      jest.runAllTimers();
    });

    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));
    const { getByTestId } = renderWithRedux(
      <GroupContent community={community} onScroll={onScroll} onGetInfoLayout={onGetInfoLayout} />,
    );
    const btnChannel = getByTestId('group_content.channel');
    fireEvent.press(btnChannel);
    expect(navigate).toBeCalledWith(groupStack.groupFiles, {
      groupId: groupDetailData.group.id,
    });
  });

  it('should render posts data correctly', () => {
    jest.useFakeTimers();
    act(() => {
      useGroupDetailStore.setState({
        groupDetail: { ...groupDetailData },
      });
    });
    act(() => {
      jest.runAllTimers();
    });

    const wrapper = renderWithRedux(
      <GroupContent community={community} onScroll={onScroll} onGetInfoLayout={onGetInfoLayout} />,
    );
    const listView = wrapper.getByTestId('list_view.flat_list');
    expect(listView.props.data.length).toBe(groupPostData.length);
  });
});
