import React from 'react';
import initialState from '~/storeRedux/initialState';
import { communityDetailData } from '~/test/mock_data/communities';

import { createTestStore, renderWithRedux } from '~/test/testUtils';
import PrivateWelcome from '.';
import GroupJoinStatus from '~/constants/GroupJoinStatus';

describe('PrivateWelcome component', () => {
  const onScroll = jest.fn();
  const onButtonLayout = jest.fn();

  const state = { ...initialState };
  const store = createTestStore(state);

  it('renders InfoHeader component correctly', () => {
    const wrapper = renderWithRedux(
      <PrivateWelcome
        onScroll={onScroll}
        onButtonLayout={onButtonLayout}
        isFetching={false}
        community={communityDetailData}
      />,
      store,
    );
    const component = wrapper.getByTestId('info_header');
    expect(component).toBeDefined();
  });

  it('renders JoinCancelButton component correctly', () => {
    const newCommunityDetailData = {
      ...communityDetailData,
      joinStatus: GroupJoinStatus.REQUESTED,
    };

    const wrapper = renderWithRedux(
      <PrivateWelcome
        onScroll={onScroll}
        onButtonLayout={onButtonLayout}
        isFetching={false}
        community={newCommunityDetailData}
      />,
      store,
    );
    const component = wrapper.getByTestId('join_cancel_button');
    expect(component).toBeDefined();
  });

  it('renders AboutContent component correctly', () => {
    const wrapper = renderWithRedux(
      <PrivateWelcome
        onScroll={onScroll}
        onButtonLayout={onButtonLayout}
        isFetching={false}
        community={communityDetailData}
      />,
      store,
    );
    const component = wrapper.getByTestId('about_content');
    expect(component).toBeDefined();
  });
});
