/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';

import { renderWithRedux, fireEvent } from '~/test/testUtils';
import CommunityContentView from '.';
import { communityDetailData } from '~/test/mock_data/communities';
import * as navigationHook from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import useModalStore from '~/store/modal';

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
    const aboutBtn = wrapper.queryByTestId('tab_button_header.about_btn-selected');
    expect(aboutBtn).toBeDefined();
  });

  it('should navigate to About page correctly', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const wrapper = renderWithRedux(
      <CommunityContentView {...baseProps} />,
    );
    const aboutBtn = wrapper.getByTestId('tab_button_header.about_btn-selected');
    fireEvent.press(aboutBtn);
    expect(navigate).toBeCalledWith(groupStack.communityAbout, { communityId: '1' });
  });

  it('should render Members button correctly', () => {
    const wrapper = renderWithRedux(
      <CommunityContentView {...baseProps} />,
    );
    const memberBtn = wrapper.queryByTestId('tab_button_header.members_btn-selected');
    expect(memberBtn).toBeDefined();
  });

  it('should navigate to Members page correctly', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const wrapper = renderWithRedux(
      <CommunityContentView {...baseProps} />,
    );
    const memberBtn = wrapper.getByTestId('tab_button_header.members_btn-selected');
    fireEvent.press(memberBtn);
    expect(navigate).toBeCalledWith(groupStack.communityMembers, {
      communityId: '1',
      isMember: false,
    });
  });

  it('should render Your Groups button and can navigate to that screen correctly when user is a member and press that button', () => {
    const newProps = {
      ...baseProps,
      isMember: true,
    };

    const showModal = jest.fn();
    useModalStore.setState((state) => {
      state.actions = { showModal } as any;
      return state;
    });

    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const wrapper = renderWithRedux(
      <CommunityContentView {...newProps} />,
    );
    const yourGroupsBtn = wrapper.getByTestId('tab_button_header.your_groups-selected');
    expect(yourGroupsBtn).toBeDefined();

    fireEvent.press(yourGroupsBtn);
    expect(showModal).toBeCalled();
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

  it('should render should render PrivateWelcome when com is private', () => {
    const newProps = {
      ...baseProps,
      isPrivateCommunity: true,
    };

    const wrapper = renderWithRedux(
      <CommunityContentView {...newProps} />,
    );

    const privateWelcome = wrapper.getByTestId('private_welcome');
    expect(privateWelcome).toBeDefined();
  });
});
