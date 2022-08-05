import React from 'react';
import initialState from '~/store/initialState';
import { communityDetailData } from '~/test/mock_data/communities';

import { createTestStore, renderWithRedux } from '~/test/testUtils';
import PrivateWelcome from './PrivateWelcome';

describe('PrivateWelcome component', () => {
  const onScroll = jest.fn();
  const onButtonLayout = jest.fn();

  const state = { ...initialState };
  // @ts-ignore
  state.groups.communityDetail = {
    ...communityDetailData,
    join_status: 1,
    privacy: 'PRIVATE',
  };
  const store = createTestStore(state);

  it('renders InfoHeader component correctly', () => {
    const wrapper = renderWithRedux(
      <PrivateWelcome onScroll={onScroll} onButtonLayout={onButtonLayout} />,
      store,
    );
    const component = wrapper.getByTestId('info_header');
    expect(component).toBeDefined();
  });

  it('renders JoinCancelButton component correctly', () => {
    const wrapper = renderWithRedux(
      <PrivateWelcome onScroll={onScroll} onButtonLayout={onButtonLayout} />,
      store,
    );
    const component = wrapper.getByTestId('join_cancel_button');
    expect(component).toBeDefined();
  });

  it('renders AboutContent component correctly', () => {
    const wrapper = renderWithRedux(
      <PrivateWelcome onScroll={onScroll} onButtonLayout={onButtonLayout} />,
      store,
    );
    const component = wrapper.getByTestId('about_content');
    expect(component).toBeDefined();
  });
});
