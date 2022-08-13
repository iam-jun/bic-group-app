import React from 'react';

import { renderWithRedux, createTestStore } from '~/test/testUtils';
import MockedNavigator from '~/test/MockedNavigator';
import CommunityDetail from '.';
import initialState from '~/store/initialState';
import { communityDetailData } from '~/test/mock_data/communities';
import { ICommunity } from '~/interfaces/ICommunity';
import { COMMUNITY_PRIVACY_TYPE } from '~/constants/privacyTypes';

describe('CommunityDetail', () => {
  const component = () => (
    <CommunityDetail route={{ params: { communityId: communityDetailData.id } }} />
  );

  it('renders Placeholder  correctly', () => {
    const state = { ...initialState };
    state.groups.loadingPage = true;
    const store = createTestStore(state);

    const wrapper = renderWithRedux(
      <MockedNavigator component={component} />,
      store,
    );
    const placeholder = wrapper.getByTestId('community_detail.placeholder');
    expect(placeholder).toBeDefined();
    const pageContent = wrapper.queryByTestId('community_detail.content');
    expect(pageContent).toBeNull();
  });

  it('should render PrivateWelcome page for guest', () => {
    const state = { ...initialState };
    state.groups.loadingPage = false;
    state.groups.communityDetail = {
      ...communityDetailData,
      joinStatus: 1,
      privacy: 'PRIVATE' as COMMUNITY_PRIVACY_TYPE,
    } as ICommunity;
    const store = createTestStore(state);

    const wrapper = renderWithRedux(
      <MockedNavigator component={component} />,
      store,
    );
    const PrivateWelcomeComp = wrapper.getByTestId('private_welcome');
    expect(PrivateWelcomeComp).toBeDefined();
  });

  it('should render PageContent page correctly when user is a member', () => {
    const state = { ...initialState };
    state.groups.loadingPage = false;
    state.groups.communityDetail = { ...communityDetailData } as ICommunity;
    const store = createTestStore(state);

    const wrapper = renderWithRedux(
      <MockedNavigator component={component} />,
      store,
    );
    const listView = wrapper.getByTestId('flatlist');
    expect(listView).toBeDefined();
    const chatIcon = wrapper.getByTestId('header.iconChat');
    expect(chatIcon).toBeDefined();
  });

  it('should render PageContent page correctly when user is not a member for OPEN/PUBLIC privacy type', () => {
    const state = { ...initialState };
    state.groups.loadingPage = false;
    state.groups.communityDetail = { ...communityDetailData, joinStatus: 1 } as ICommunity;
    const store = createTestStore(state);

    const wrapper = renderWithRedux(
      <MockedNavigator component={component} />,
      store,
    );

    // should render PageContent component
    const listView = wrapper.getByTestId('flatlist');
    expect(listView).toBeDefined();
  });

  it('should not render chat icon correctly for PRIVATE privacy type when user is a guest', () => {
    const state = { ...initialState };
    state.groups.communityDetail = {
      ...communityDetailData,
      joinStatus: 1,
      privacy: 'PRIVATE',
    };
    const store = createTestStore(state);

    const wrapper = renderWithRedux(
      <MockedNavigator component={component} />,
      store,
    );
    const chatIcon = wrapper.queryByTestId('header.iconChat');
    expect(chatIcon).toBeNull();
  });
});
