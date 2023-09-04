import React from 'react';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import SearchCommunityView from './SearchCommunityView';
import useSearchJoinedCommunitiesStore from '~/screens/communities/Communities/components/SearchCommunity/store';
import { mockCommunitySearchResponse } from '~/test/mock_data/advancedSettings';

describe('SearchCommunityView modal component', () => {
  it('should render correctly with communities and should call prop onPressItem', () => {
    const newIds = mockCommunitySearchResponse.data.map((item) => item.id);
    const newItems = mockCommunitySearchResponse.data.reduce(
      (accumulator, currentItem) => ({
        ...accumulator,
        [currentItem.id]: currentItem,
      }),
      {},
    );
    useSearchJoinedCommunitiesStore.setState((state) => {
      state.ids = newIds;
      state.items = newItems;
      return state;
    });

    const onClose = jest.fn();
    const onPressCommuntiyItem = jest.fn();
    const wrapper = renderWithRedux(
      <SearchCommunityView
        isOpen
        onClose={onClose}
        onPressItem={onPressCommuntiyItem}
      />,
    );

    const searchView = wrapper.queryByTestId('search_base_view');
    expect(searchView).toBeDefined();

    const communitieComponents = wrapper.queryAllByTestId('notification_advanced_setting_item');
    expect(communitieComponents.length).toEqual(newIds.length);

    fireEvent.press(communitieComponents[0]);
    expect(onPressCommuntiyItem).toBeCalled();
  });

  it('should render empty if no community and will call prop onClose', () => {
    useSearchJoinedCommunitiesStore.setState((state) => {
      state.ids = [];
      state.items = {};
      return state;
    });

    const onClose = jest.fn();
    const onPressCommuntiyItem = jest.fn();
    const wrapper = renderWithRedux(
      <SearchCommunityView
        isOpen
        onClose={onClose}
        onPressItem={onPressCommuntiyItem}
      />,
    );

    const searchView = wrapper.queryByTestId('search_base_view');
    expect(searchView).toBeDefined();

    const emptyView = wrapper.queryByTestId('empty_screen');
    expect(emptyView).toBeDefined();

    const iconBack = wrapper.queryByTestId('search_base_view.back_button');
    expect(iconBack).toBeDefined();
    fireEvent.press(iconBack);
    expect(onClose).toBeCalled();
  });

  it('should render loading if is loading', () => {
    useSearchJoinedCommunitiesStore.setState((state) => {
      state.ids = [];
      state.items = {};
      state.hasNextPage = true;
      state.loading = true;
      return state;
    });

    const onClose = jest.fn();
    const onPressCommuntiyItem = jest.fn();
    const wrapper = renderWithRedux(
      <SearchCommunityView
        isOpen
        onClose={onClose}
        onPressItem={onPressCommuntiyItem}
      />,
    );

    const searchView = wrapper.queryByTestId('search_base_view');
    expect(searchView).toBeDefined();

    const loadingView = wrapper.queryByTestId('your_communites.loading_more');
    expect(loadingView).toBeDefined();
  });
});
