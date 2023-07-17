import React from 'react';
import { fireEvent, languages, renderWithRedux } from '~/test/testUtils';
import SearchDiscoverCommunityItem from './SearchDiscoverCommunityItem';
import { mockDiscoverCommunityResponse } from '~/test/mock_data/discoverCommunity';
import GroupJoinStatus from '~/constants/GroupJoinStatus';

describe('SearchDiscoverCommunityItem component', () => {
  const mockData = mockDiscoverCommunityResponse.data;
  const testID = 'discover_community_item';
  it('given joinStatus = VISITOR, should render button join', () => {
    const onView = jest.fn();
    const onJoin = jest.fn();
    const onCancel = jest.fn();

    const wrapper = renderWithRedux(
      <SearchDiscoverCommunityItem
        testID={testID}
        item={mockData[0]}
        onView={onView}
        onJoin={onJoin}
        onCancel={onCancel}
      />,
    );
    const btn = wrapper.getByText(languages.common.btn_join);
    fireEvent.press(btn);
    expect(onJoin).toBeCalled();
  });

  it('given joinStatus = MEMBER, should render button view', () => {
    const onView = jest.fn();
    const onJoin = jest.fn();
    const onCancel = jest.fn();

    const wrapper = renderWithRedux(
      <SearchDiscoverCommunityItem
        testID={testID}
        item={{ ...mockData[0], joinStatus: GroupJoinStatus.MEMBER }}
        onView={onView}
        onJoin={onJoin}
        onCancel={onCancel}
      />,
    );
    const btn = wrapper.getByText(languages.common.btn_view);
    fireEvent.press(btn);
    expect(onView).toBeCalled();
  });

  it('given joinStatus = REQUESTED, should render button cancel request', () => {
    const onView = jest.fn();
    const onJoin = jest.fn();
    const onCancel = jest.fn();

    const wrapper = renderWithRedux(
      <SearchDiscoverCommunityItem
        testID={testID}
        item={{ ...mockData[0], joinStatus: GroupJoinStatus.REQUESTED }}
        onView={onView}
        onJoin={onJoin}
        onCancel={onCancel}
      />,
    );
    const btn = wrapper.getByText(languages.common.btn_cancel_request);
    fireEvent.press(btn);
    expect(onCancel).toBeCalled();
  });
});
