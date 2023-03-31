import React from 'react';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import Index from './index';

describe('Discover Communities screen', () => {
  it('should render correctly', () => {
    const wrapper = renderWithRedux(
      <Index />,
    );
    const iconSearch = wrapper.queryByTestId('header.icon.button');
    expect(iconSearch).toBeDefined();
    fireEvent.press(iconSearch);

    const listCommunity = wrapper.queryByTestId('discover_communities.list');
    expect(listCommunity).toBeDefined();

    const searchCommunitiesView = wrapper.queryByTestId('search_community_view.type_search');
    expect(searchCommunitiesView).toBeDefined();
  });
});
