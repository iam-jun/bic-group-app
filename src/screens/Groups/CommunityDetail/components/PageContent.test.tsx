import React from 'react';

import {renderWithRedux, createTestStore, fireEvent} from '~/test/testUtils';
import PageContent from './PageContent';
import initialState from '~/store/initialState';
import {communityDetailData} from '~/test/mock_data/communities';
import * as navigationHook from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import {groupPostData} from '~/test/mock_data/group';

describe('PageContent', () => {
  const communityId = communityDetailData.id;
  const onScroll = jest.fn();
  const onButtonLayout = jest.fn();
  const getPosts = jest.fn();

  it('should render InfoHeader correctly', () => {
    const wrapper = renderWithRedux(
      <PageContent
        communityId={communityId}
        onScroll={onScroll}
        onButtonLayout={onButtonLayout}
        getPosts={getPosts}
      />,
    );
    const infoHeaderComp = wrapper.getByTestId('info_header');
    expect(infoHeaderComp).toBeDefined();
  });

  it('should render About button correctly', () => {
    const wrapper = renderWithRedux(
      <PageContent
        communityId={communityId}
        getPosts={getPosts}
        onScroll={onScroll}
        onButtonLayout={onButtonLayout}
      />,
    );
    const aboutBtn = wrapper.getByTestId('page_content.about_btn');
    expect(aboutBtn).toBeDefined();
  });

  it('should navigate to About page correctly', () => {
    const navigate = jest.fn();
    const rootNavigation = {navigate};
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => {
      return {rootNavigation} as any;
    });

    const wrapper = renderWithRedux(
      <PageContent
        communityId={communityId}
        getPosts={getPosts}
        onScroll={onScroll}
        onButtonLayout={onButtonLayout}
      />,
    );
    const aboutBtn = wrapper.getByTestId('page_content.about_btn');
    fireEvent.press(aboutBtn);
    expect(navigate).toBeCalledWith(groupStack.communityAbout);
  });

  it('should render Members button correctly', () => {
    const wrapper = renderWithRedux(
      <PageContent
        communityId={communityId}
        getPosts={getPosts}
        onScroll={onScroll}
        onButtonLayout={onButtonLayout}
      />,
    );
    const memberBtn = wrapper.getByTestId('page_content.members_btn');
    expect(memberBtn).toBeDefined();
  });

  it('should render Your Groups button and can navigate to that screen correctly when user is a member and press that button', () => {
    const state = {...initialState};
    // @ts-ignore
    state.groups.communityDetail = {...communityDetailData};
    const store = createTestStore(state);

    const navigate = jest.fn();
    const rootNavigation = {navigate};
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => {
      return {rootNavigation} as any;
    });

    const wrapper = renderWithRedux(
      <PageContent
        communityId={communityId}
        getPosts={getPosts}
        onScroll={onScroll}
        onButtonLayout={onButtonLayout}
      />,
      store,
    );
    const yourGroupsBtn = wrapper.getByTestId('page_content.your_groups_btn');
    expect(yourGroupsBtn).toBeDefined();

    fireEvent.press(yourGroupsBtn);
    expect(navigate).toBeCalledWith(groupStack.yourGroups, {communityId});
  });

  it('should not render Your Groups button correctly when user is not a member', () => {
    const state = {...initialState};
    // @ts-ignore
    state.groups.communityDetail = {...communityDetailData, join_status: 1};
    const store = createTestStore(state);
    const wrapper = renderWithRedux(
      <PageContent
        communityId={communityId}
        getPosts={getPosts}
        onScroll={onScroll}
        onButtonLayout={onButtonLayout}
      />,
      store,
    );
    const yourGroupsBtn = wrapper.queryByTestId('page_content.your_groups_btn');
    expect(yourGroupsBtn).toBeNull();
  });

  it('should render Discover button correctly when user is a member', () => {
    const state = {...initialState};
    // @ts-ignore
    state.groups.communityDetail = {...communityDetailData};
    const store = createTestStore(state);
    const wrapper = renderWithRedux(
      <PageContent
        communityId={communityId}
        getPosts={getPosts}
        onScroll={onScroll}
        onButtonLayout={onButtonLayout}
      />,
      store,
    );
    const yourGroupsBtn = wrapper.getByTestId('page_content.discover_btn');
    expect(yourGroupsBtn).toBeDefined();
  });

  it('should not render Discover button correctly when user is not a member', () => {
    const state = {...initialState};
    // @ts-ignore
    state.groups.communityDetail = {...communityDetailData, join_status: 1};
    const store = createTestStore(state);
    const wrapper = renderWithRedux(
      <PageContent
        communityId={communityId}
        getPosts={getPosts}
        onScroll={onScroll}
        onButtonLayout={onButtonLayout}
      />,
      store,
    );
    const yourGroupsBtn = wrapper.queryByTestId('page_content.discover_btn');
    expect(yourGroupsBtn).toBeNull();
  });

  it('should renders Join/Cancel button correctly when user is not a member', () => {
    const state = {...initialState};
    // @ts-ignore
    state.groups.communityDetail = {...communityDetailData, join_status: 1};
    const store = createTestStore(state);
    const wrapper = renderWithRedux(
      <PageContent
        communityId={communityId}
        getPosts={getPosts}
        onScroll={onScroll}
        onButtonLayout={onButtonLayout}
      />,
      store,
    );
    const joinCancelButton = wrapper.getByTestId('join_cancel_button');
    expect(joinCancelButton).toBeDefined();
  });

  it('should render posts data and create post shortcut correctly', () => {
    const state = {...initialState};
    // @ts-ignore
    state.groups.communityDetail = {...communityDetailData};
    // @ts-ignore
    state.groups.posts.data = [...groupPostData];
    const store = createTestStore(state);
    const wrapper = renderWithRedux(
      <PageContent
        communityId={communityId}
        getPosts={getPosts}
        onScroll={onScroll}
        onButtonLayout={onButtonLayout}
      />,
      store,
    );

    const createPostBtn = wrapper.getByTestId('header_create_post');
    expect(createPostBtn).toBeDefined();
    const listView = wrapper.getByTestId('list_view.flat_list');
    expect(listView.props.data.length).toBe(groupPostData.length);
  });

  it('should not render create post shortcut, but still render post data when user is not a member', () => {
    const state = {...initialState};
    // @ts-ignore
    state.groups.communityDetail = {...communityDetailData, join_status: 1};
    // @ts-ignore
    state.groups.posts.data = [...groupPostData];
    const store = createTestStore(state);
    const wrapper = renderWithRedux(
      <PageContent
        communityId={communityId}
        getPosts={getPosts}
        onScroll={onScroll}
        onButtonLayout={onButtonLayout}
      />,
      store,
    );

    const createPostBtn = wrapper.queryByTestId('header_create_post');
    expect(createPostBtn).toBeNull();
    const listView = wrapper.getByTestId('list_view.flat_list');
    expect(listView.props.data.length).toBe(groupPostData.length);
  });
});
