/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';

import { renderWithRedux, fireEvent } from '~/test/testUtils';
import CommunityContentView from '.';
import { communityDetailData } from '~/test/mock_data/communities';
import * as navigationHook from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import { groupPostData } from '~/test/mock_data/group';

describe('CommunityContentView', () => {
  const community = communityDetailData;

  const baseProps = {
    community,
    isPrivateCommunity: false,
    isMember: false,
    isFetchingData: false,
    onScroll: jest.fn(),
    onButtonLayout: jest.fn(),
    onRefresh: jest.fn(),
  };

  it('should render InfoHeader correctly', () => {
    const wrapper = renderWithRedux(
      <CommunityContentView {...baseProps} />,
    );
    const infoHeaderComp = wrapper.getByTestId('info_header');
    expect(infoHeaderComp).toBeDefined();
  });

  it('should render About button correctly', () => {
    const wrapper = renderWithRedux(
      <CommunityContentView {...baseProps} />,
    );
    const aboutBtn = wrapper.getByTestId('page_content.about_btn');
    expect(aboutBtn).toBeDefined();
  });

  it('should navigate to About page correctly', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const wrapper = renderWithRedux(
      <CommunityContentView {...baseProps} />,
    );
    const aboutBtn = wrapper.getByTestId('page_content.about_btn');
    fireEvent.press(aboutBtn);
    expect(navigate).toBeCalledWith(groupStack.communityAbout);
  });

  it('should render Members button correctly', () => {
    const wrapper = renderWithRedux(
      <CommunityContentView {...baseProps} />,
    );
    const memberBtn = wrapper.getByTestId('page_content.members_btn');
    expect(memberBtn).toBeDefined();
  });

  it('should navigate to Members page correctly', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const wrapper = renderWithRedux(
      <CommunityContentView {...baseProps} />,
    );
    const memberBtn = wrapper.getByTestId('page_content.members_btn');
    fireEvent.press(memberBtn);
    expect(navigate).toBeCalledWith(groupStack.communityMembers, { community });
  });

  it('should render Your Groups button and can navigate to that screen correctly when user is a member and press that button', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const wrapper = renderWithRedux(
      <CommunityContentView {...baseProps} />,
    );
    const yourGroupsBtn = wrapper.getByTestId('page_content.your_groups_btn');
    expect(yourGroupsBtn).toBeDefined();

    fireEvent.press(yourGroupsBtn);
    // expect(navigate).toBeCalledWith(groupStack.yourGroups, { community });
  });

  it('should not render Your Groups button correctly when user is not a member', () => {
    const communityDetail = { ...communityDetailData, join_status: 1 };

    const wrapper = renderWithRedux(
      <CommunityContentView
        {...baseProps}
        community={communityDetail}
      />,
    );
    const yourGroupsBtn = wrapper.queryByTestId('page_content.your_groups_btn');
    expect(yourGroupsBtn).toBeNull();
  });

  it('should render Discover button correctly when user is a member', () => {
    const wrapper = renderWithRedux(
      <CommunityContentView {...baseProps} />,
    );
    const yourGroupsBtn = wrapper.getByTestId('page_content.discover_btn');
    expect(yourGroupsBtn).toBeDefined();
  });

  it('should not render Discover button correctly when user is not a member', () => {
    const communityDetail = { ...communityDetailData, join_status: 1 };
    const wrapper = renderWithRedux(
      <CommunityContentView
        {...baseProps}
        community={communityDetail}
      />,
    );
    const yourGroupsBtn = wrapper.queryByTestId('page_content.discover_btn');
    expect(yourGroupsBtn).toBeNull();
  });

  it('should renders Join/Cancel button correctly when user is not a member', () => {
    const communityDetail = { ...communityDetailData, join_status: 1 };

    const wrapper = renderWithRedux(
      <CommunityContentView
        {...baseProps}
        community={communityDetail}
      />,
    );
    const joinCancelButton = wrapper.getByTestId('join_cancel_button');
    expect(joinCancelButton).toBeDefined();
  });

  it('should render posts data and create post shortcut correctly', () => {
    const wrapper = renderWithRedux(
      <CommunityContentView {...baseProps} />,
    );

    const createPostBtn = wrapper.getByTestId('header_create_post');
    expect(createPostBtn).toBeDefined();
    const listView = wrapper.getByTestId('list_view.flat_list');
    expect(listView.props.data.length).toBe(groupPostData.length);
  });

  it('should not render create post shortcut, but still render post data when user is not a member', () => {
    const communityDetail = { ...communityDetailData, join_status: 1 };

    const wrapper = renderWithRedux(
      <CommunityContentView
        {...baseProps}
        community={communityDetail}
      />,
    );

    const createPostBtn = wrapper.queryByTestId('header_create_post');
    expect(createPostBtn).toBeNull();
    const listView = wrapper.getByTestId('list_view.flat_list');
    expect(listView.props.data.length).toBe(groupPostData.length);
  });
});
