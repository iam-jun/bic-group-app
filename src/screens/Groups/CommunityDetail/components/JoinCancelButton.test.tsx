import React from 'react';

import {renderWithRedux, createTestStore} from '~/test/testUtils';
import JoinCancelButton from './JoinCancelButton';
import initialState from '~/store/initialState';
import {communityDetailData} from '~/test/mock_data/communities';

describe('JoinCancelButton', () => {
  it('should show button when user is not a member', () => {
    const state = {...initialState};
    // @ts-ignore
    state.groups.communityDetail = {...communityDetailData, join_status: 1};
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<JoinCancelButton />, store);
    const buttonComp = wrapper.getByTestId('join_cancel_button');
    expect(buttonComp).toBeDefined();
  });

  it('should show Join button when user has not joined the community', () => {
    const state = {...initialState};
    // @ts-ignore
    state.groups.communityDetail = {...communityDetailData, join_status: 1};
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<JoinCancelButton />, store);
    const buttonComp = wrapper.getByTestId('join_cancel_button.join');
    expect(buttonComp).toBeDefined();
  });

  it('should show Cancel request button when user has requested to join the community', () => {
    const state = {...initialState};
    // @ts-ignore
    state.groups.communityDetail = {
      ...communityDetailData,
      join_status: 3,
      privacy: 'PRIVATE',
    };
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<JoinCancelButton />, store);
    const buttonComp = wrapper.getByTestId('join_cancel_button.cancel');
    expect(buttonComp).toBeDefined();
  });

  it('should not show button when user is already a member', () => {
    const state = {...initialState};
    // @ts-ignore
    state.groups.communityDetail = {...communityDetailData, join_status: 2};
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<JoinCancelButton />, store);
    const buttonComp = wrapper.queryByTestId('join_cancel_button');
    expect(buttonComp).toBeNull();
  });

  it('should show Join description for Private privacy type for guest', () => {
    const state = {...initialState};
    // @ts-ignore
    state.groups.communityDetail = {
      ...communityDetailData,
      join_status: 1,
      privacy: 'PRIVATE',
    };
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<JoinCancelButton />, store);
    const buttonComp = wrapper.getByTestId('join_cancel_button');
    expect(buttonComp).toBeDefined();
    const descriptionText = wrapper.getByTestId(
      'join_cancel_button.description',
    );
    expect(descriptionText.props.children).toBe(
      'Join this community to view or participate on discussions',
    );
  });
});
