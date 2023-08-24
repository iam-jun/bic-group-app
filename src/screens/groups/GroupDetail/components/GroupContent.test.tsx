import React from 'react';

import { renderWithRedux } from '~/test/testUtils';
import GroupContent from './GroupContent';
import { groupDetailData } from '~/test/mock_data/group';
import { communityDetailData } from '~/test/mock_data/communities';
import useGroupsStore from '~/store/entities/groups';

describe('GroupContent component', () => {
  const onScroll = jest.fn();
  const onGetInfoLayout = jest.fn();
  const community = { ...communityDetailData };

  it('renders GroupContent component correctly', () => {
    useGroupsStore.getState().actions.addToGroups(groupDetailData);

    const wrapper = renderWithRedux(
      <GroupContent
        groupId={communityDetailData.groupId}
        community={community}
        onScroll={onScroll}
        onGetInfoLayout={onGetInfoLayout}
      />,
    );
    const component = wrapper.getByTestId('flatlist');
    expect(component).toBeDefined();
  });
});
