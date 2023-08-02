import React from 'react';

import { fireEvent, render, renderWithRedux } from '~/test/testUtils';
import MenuDiscoverCommunity from './MenuDiscoverCommunity';
import { communities } from '~/test/mock_data/communities';
import useMenuController from '../store';
import * as common from '~/helpers/common';

describe('MenuDiscoverCommunity component', () => {
  it('renders loading list:', () => {
    useMenuController.setState((state) => {
      state.data = [];
      state.loading = true;
      return state;
    });
    const rendered = render(<MenuDiscoverCommunity />);

    const loadingComponent = rendered.queryByTestId('menu_discover_community.loading');
    expect(loadingComponent).toBeDefined();
  });

  it('should push to community detail screen when click community item', () => {
    useMenuController.setState((state) => {
      state.data = communities as any;
      state.loading = false;
      return state;
    });

    const navigateToCommunityDetail = jest.spyOn(common, 'navigateToCommunityDetail');

    const rendered = renderWithRedux(<MenuDiscoverCommunity />);

    const itemsComponent = rendered.queryAllByTestId('menu_discover_community.item');
    expect(itemsComponent).toBeDefined();
    expect(itemsComponent.length).toEqual(communities.length);

    expect(itemsComponent[0]).toBeDefined();
    fireEvent.press(itemsComponent[0]);
    expect(navigateToCommunityDetail).toBeCalled();
  });

  it('renders empty list:', () => {
    useMenuController.setState((state) => {
      state.data = [];
      state.loading = false;
      return state;
    });
    const rendered = render(<MenuDiscoverCommunity />);

    const emptyComponent = rendered.queryByTestId('menu_discover_community.empty_list');
    expect(emptyComponent).toBeDefined();
  });
});
