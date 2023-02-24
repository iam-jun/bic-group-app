import React from 'react';

import { fireEvent, render, renderWithRedux } from '~/test/testUtils';
import MenuDiscoverCommunity from './MenuDiscoverCommunity';
import * as navigationHook from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import { communities } from '~/test/mock_data/communities';
import useMenuController from '../store';

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

  it('should navigate to community detail screen when click community item', () => {
    useMenuController.setState((state) => {
      state.data = communities as any;
      state.loading = false;
      return state;
    });

    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const rendered = renderWithRedux(<MenuDiscoverCommunity />);

    const itemsComponent = rendered.queryAllByTestId('menu_discover_community.item');
    expect(itemsComponent).toBeDefined();
    expect(itemsComponent.length).toEqual(communities.length);

    expect(itemsComponent[0]).toBeDefined();
    fireEvent.press(itemsComponent[0]);
    expect(navigate).toHaveBeenCalledWith(groupStack.communityDetail, { communityId: communities[0].id });
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
