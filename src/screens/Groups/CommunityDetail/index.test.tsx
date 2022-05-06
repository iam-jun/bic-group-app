import React from 'react';

import {renderWithRedux, createTestStore} from '~/test/testUtils';
import MockedNavigator from '~/test/MockedNavigator';
import CommunityDetail from '.';
import initialState from '~/store/initialState';
import {communityDetailData} from '~/test/mock_data/communities';

describe('CommunityDetail', () => {
  const component = () => (
    <CommunityDetail route={{params: {communityId: communityDetailData.id}}} />
  );

  it('should render PrivateWelcome page for guest', () => {
    const state = {...initialState};
    // @ts-ignore
    state.groups.communityDetail = {
      ...communityDetailData,
      join_status: 1,
      privacy: 'PRIVATE',
    };
    const store = createTestStore(state);

    const wrapper = renderWithRedux(
      <MockedNavigator component={component} />,
      store,
    );
    const PrivateWelcomeComp = wrapper.getByTestId('private_welcome');
    expect(PrivateWelcomeComp).toBeDefined();
  });

  it('should render community detail correctly when user is a member', () => {
    const state = {...initialState};
    // @ts-ignore
    state.groups.communityDetail = {...communityDetailData};
    const store = createTestStore(state);

    const wrapper = renderWithRedux(
      <MockedNavigator component={component} />,
      store,
    );
    const listView = wrapper.getByTestId('list_view');
    expect(listView).toBeDefined();
    const chatIcon = wrapper.getByTestId('header.iconChat');
    expect(chatIcon).toBeDefined();
  });

  it('should render chat icon correctly when for OPEN/PUBLIC privacy type when user is a guest', () => {
    const state = {...initialState};
    // @ts-ignore
    state.groups.communityDetail = {...communityDetailData, join_status: 1};
    const store = createTestStore(state);

    const wrapper = renderWithRedux(
      <MockedNavigator component={component} />,
      store,
    );
    const chatIcon = wrapper.getByTestId('header.iconChat');
    expect(chatIcon).toBeDefined();
  });

  it('should not render chat icon correctly when for PRIVATE privacy type when user is a guest', () => {
    const state = {...initialState};
    // @ts-ignore
    state.groups.communityDetail = {
      ...communityDetailData,
      join_status: 1,
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
