import React from 'react';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import { mockGroupInFlat } from '~/test/mock_data/advancedSettings';
import SearchGroupView from './SearchGroupView';
import useAdvancedNotiSettingsStore from '../store';

describe('SearchGroupView modal component', () => {
  it('should render correctly with groups and should call prop onPressItem', () => {
    useAdvancedNotiSettingsStore.setState((state) => {
      state.isLoadingJoinedGroup = false;
      state.searchJoinedGroups = mockGroupInFlat.data as any;
      state.hasSearchNextPage = false;
      return state;
    });

    const onClose = jest.fn();
    const onPressItem = jest.fn();

    const wrapper = renderWithRedux(
      <SearchGroupView
        isOpen
        onClose={onClose}
        onPressItem={onPressItem}
      />,
    );

    const searchView = wrapper.queryByTestId('search_base_view');
    expect(searchView).toBeDefined();

    const groupComponents = wrapper.queryAllByTestId('notification_advanced_setting_item');
    expect(groupComponents.length).toEqual(mockGroupInFlat.data.length);

    fireEvent.press(groupComponents[0]);
    expect(onPressItem).toBeCalled();
  });

  it('should render empty if no group and will call prop onClose', () => {
    useAdvancedNotiSettingsStore.setState((state) => {
      state.isLoadingJoinedGroup = false;
      state.searchJoinedGroups = [];
      return state;
    });

    const onClose = jest.fn();
    const onPressItem = jest.fn();

    const wrapper = renderWithRedux(
      <SearchGroupView
        isOpen
        onClose={onClose}
        onPressItem={onPressItem}
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
    useAdvancedNotiSettingsStore.setState((state) => {
      state.isLoadingJoinedGroup = true;
      state.hasSearchNextPage = true;
      state.searchJoinedGroups = [];
      return state;
    });

    const onClose = jest.fn();
    const onPressItem = jest.fn();

    const wrapper = renderWithRedux(
      <SearchGroupView
        isOpen
        onClose={onClose}
        onPressItem={onPressItem}
      />,
    );

    const searchView = wrapper.queryByTestId('search_base_view');
    expect(searchView).toBeDefined();

    const loadingView = wrapper.queryByTestId('search_group.loading_more');
    expect(loadingView).toBeDefined();
  });
});
