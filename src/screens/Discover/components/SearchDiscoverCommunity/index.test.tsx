/* eslint-disable @typescript-eslint/no-var-requires */

import React from 'react';

import {
  languages,
  renderWithRedux,
} from '~/test/testUtils';

import SearchDiscoverCommunity from './index';

describe('Discover Communities screen', () => {
  it('should render empty screen type search if search text is empty', () => {
    const wrapper = renderWithRedux(
      <SearchDiscoverCommunity isOpen />,
    );

    const emptySearchComp = wrapper.queryByTestId('search_community_view.type_search');
    expect(emptySearchComp).toBeDefined();
    expect(emptySearchComp.children[0]).toEqual(languages.common.text_type_search_keyword);
  });

  it('should render search result screen if search text is not empty', () => {
    const wrapper = renderWithRedux(
      <SearchDiscoverCommunity initSearch="test" isOpen />,
    );

    const searchResult = wrapper.queryByTestId('community_search_results.list');
    expect(searchResult).toBeDefined();
  });
});
