import React from 'react';
import { renderWithRedux } from '~/test/testUtils';
import SearchCommunityView from '.';

describe('SearchCommunityView component', () => {
  const isOpen = true;
  const onPressCommunity = jest.fn();

  it('should render Type search keyword description correctly', () => {
    const wrapper = renderWithRedux(
      <SearchCommunityView
        isOpen={isOpen}
        initSearch=""
        onPressCommunity={onPressCommunity}
      />,
    );
    const textComponent = wrapper.getByTestId(
      'search_community_view.type_search',
    );
    expect(textComponent.props.children).toBe(
      'Type search keyword to see the search results',
    );
  });

  it('should render data list correctly', () => {
    const wrapper = renderWithRedux(
      <SearchCommunityView
        isOpen={isOpen}
        initSearch="test"
        onPressCommunity={onPressCommunity}
      />,
    );
    const textComponent = wrapper.queryByTestId(
      'search_community_view.type_search',
    );
    expect(textComponent).toBeNull();

    const dataList = wrapper.getByTestId('flatlist');
    expect(dataList).toBeDefined();
  });
});
