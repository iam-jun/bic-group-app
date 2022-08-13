import React from 'react';
import * as navigationHook from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';

import { createTestStore, renderWithRedux, fireEvent } from '~/test/testUtils';
import GroupContent from './GroupContent';
import initialState from '~/store/initialState';
import { groupDetailData, groupPostData } from '~/test/mock_data/group';

describe('GroupContent component', () => {
  const getGroupPosts = jest.fn();
  const onScroll = jest.fn();
  const onGetInfoLayout = jest.fn();

  it('renders Post button when user is a group member correctly', () => {
    const state = { ...initialState };
    state.groups.groupDetail = { ...groupDetailData };
    const store = createTestStore(state);

    const { getByTestId } = renderWithRedux(
      <GroupContent getGroupPosts={getGroupPosts} onScroll={onScroll} onGetInfoLayout={onGetInfoLayout} />,
      store,
    );
    const postButton = getByTestId('group_content.post');
    expect(postButton).toBeDefined();
    fireEvent.press(postButton);
  });

  it('should not render Post button when user is not a group member correctly', () => {
    const state = { ...initialState };
    state.groups.groupDetail = { ...groupDetailData, joinStatus: 1 };
    const store = createTestStore(state);

    const { queryByTestId } = renderWithRedux(
      <GroupContent getGroupPosts={getGroupPosts} onScroll={onScroll} onGetInfoLayout={onGetInfoLayout} />,
      store,
    );
    const postButton = queryByTestId('group_content.post');
    expect(postButton).toBeNull();
  });

  it('renders Channel button correctly', () => {
    const state = { ...initialState };
    state.groups.groupDetail = { ...groupDetailData };
    const store = createTestStore(state);

    const { getByTestId } = renderWithRedux(
      <GroupContent getGroupPosts={getGroupPosts} onScroll={onScroll} onGetInfoLayout={onGetInfoLayout} />,
      store,
    );
    const channelButton = getByTestId('group_content.channel');
    expect(channelButton).toBeDefined();
  });

  it('renders About button correctly', () => {
    const state = { ...initialState };
    state.groups.groupDetail = { ...groupDetailData };
    const store = createTestStore(state);

    const { getByTestId } = renderWithRedux(
      <GroupContent getGroupPosts={getGroupPosts} onScroll={onScroll} onGetInfoLayout={onGetInfoLayout} />,
      store,
    );
    const aboutButton = getByTestId('group_content.about');
    expect(aboutButton).toBeDefined();
  });

  it('renders Members button correctly when user is not a member but the group is public', () => {
    const state = { ...initialState };
    state.groups.groupDetail = { ...groupDetailData, joinStatus: 1 };
    const store = createTestStore(state);

    const { getByTestId } = renderWithRedux(
      <GroupContent getGroupPosts={getGroupPosts} onScroll={onScroll} onGetInfoLayout={onGetInfoLayout} />,
      store,
    );
    const membersButton = getByTestId('group_content.members');
    expect(membersButton).toBeDefined();
  });

  it('should not render Members button correctly when user is not a member and the group is private', () => {
    const state = { ...initialState };
    state.groups.groupDetail = {
      ...groupDetailData,
      joinStatus: 1,
      group: { ...groupDetailData.group, privacy: 'PRIVATE' },
    };
    const store = createTestStore(state);

    const { queryByTestId } = renderWithRedux(
      <GroupContent getGroupPosts={getGroupPosts} onScroll={onScroll} onGetInfoLayout={onGetInfoLayout} />,
      store,
    );
    const membersButton = queryByTestId('group_content.members');
    expect(membersButton).toBeNull();
  });

  it('renders Files button correctly', () => {
    const state = { ...initialState };
    state.groups.groupDetail = { ...groupDetailData };
    const store = createTestStore(state);

    const { getByTestId } = renderWithRedux(
      <GroupContent getGroupPosts={getGroupPosts} onScroll={onScroll} onGetInfoLayout={onGetInfoLayout} />,
      store,
    );
    const filesButton = getByTestId('group_content.files');
    expect(filesButton).toBeDefined();
  });

  it('should navigate to screen About when pressing About button', () => {
    const state = { ...initialState };
    state.groups.groupDetail = { ...groupDetailData };
    const store = createTestStore(state);

    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));
    const { getByTestId } = renderWithRedux(
      <GroupContent getGroupPosts={getGroupPosts} onScroll={onScroll} onGetInfoLayout={onGetInfoLayout} />,
      store,
    );
    const btnAbout = getByTestId('group_content.about');
    fireEvent.press(btnAbout);
    expect(navigate).toBeCalledWith(groupStack.groupAbout, {
      groupId: state.groups.groupDetail.group.id,
    });
  });

  it('should navigate to screen Members when pressing Members button', () => {
    const state = { ...initialState };
    state.groups.groupDetail = { ...groupDetailData };
    const store = createTestStore(state);

    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));
    const { getByTestId } = renderWithRedux(
      <GroupContent getGroupPosts={getGroupPosts} onScroll={onScroll} onGetInfoLayout={onGetInfoLayout} />,
      store,
    );
    const btnMembers = getByTestId('group_content.members');
    fireEvent.press(btnMembers);
    expect(navigate).toBeCalledWith(groupStack.groupMembers, {
      groupId: state.groups.groupDetail.group.id,
    });
  });

  it('should navigate to screen Files when pressing Files button', () => {
    const state = { ...initialState };
    state.groups.groupDetail = { ...groupDetailData };
    const store = createTestStore(state);

    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));
    const { getByTestId } = renderWithRedux(
      <GroupContent getGroupPosts={getGroupPosts} onScroll={onScroll} onGetInfoLayout={onGetInfoLayout} />,
      store,
    );
    const btnFiles = getByTestId('group_content.files');
    fireEvent.press(btnFiles);
    expect(navigate).toBeCalledWith(groupStack.groupFiles, {
      groupId: state.groups.groupDetail.group.id,
    });
  });

  it('should navigate to screen Channel when pressing Channel button', () => {
    const state = { ...initialState };
    state.groups.groupDetail = { ...groupDetailData };
    const store = createTestStore(state);

    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));
    const { getByTestId } = renderWithRedux(
      <GroupContent getGroupPosts={getGroupPosts} onScroll={onScroll} onGetInfoLayout={onGetInfoLayout} />,
      store,
    );
    const btnChannel = getByTestId('group_content.channel');
    fireEvent.press(btnChannel);
    expect(navigate).toBeCalledWith(groupStack.groupFiles, {
      groupId: state.groups.groupDetail.group.id,
    });
  });

  it('should render posts data correctly', () => {
    const state = { ...initialState };
    state.groups.groupDetail = { ...groupDetailData };
    state.groups.posts.data = [...groupPostData];
    const store = createTestStore(state);
    const wrapper = renderWithRedux(
      <GroupContent getGroupPosts={getGroupPosts} onScroll={onScroll} onGetInfoLayout={onGetInfoLayout} />,
      store,
    );
    const listView = wrapper.getByTestId('list_view.flat_list');
    expect(listView.props.data.length).toBe(groupPostData.length);
  });
});
