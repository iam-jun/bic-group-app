import React from 'react';

import { createTestStore, renderWithRedux } from '~/test/testUtils';
import DiscoverGroups from '.';

import initialState from '~/storeRedux/initialState';
import { discoverGroup } from '~/test/mock_data/group';
import MockedNavigator from '~/test/MockedNavigator';

describe('DiscoverGroups component', () => {
  const communityId = 1;
  const component = () => <DiscoverGroups route={{ params: { communityId } }} />;

  it('should render data correctly', () => {
    const state = { ...initialState };
    state.groups.discoverGroups = {
      loading: false,
      canLoadMore: false,
      ids: [discoverGroup.id],
      items: { [discoverGroup.id]: discoverGroup },
    };
    const store = createTestStore(state);
    const wrapper = renderWithRedux(
      <MockedNavigator component={component} />,
      store,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
