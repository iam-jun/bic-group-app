import React from 'react';
import { listDiscoverCommunities } from '~/test/mock_data/communities';

import { fireEvent, renderWithRedux } from '~/test/testUtils';
import useMenuController from '../store';
import MenuDiscoverCommunity from './MenuDiscoverCommunity';
import * as navigationHook from '~/hooks/navigation';

describe('MenuDiscoverCommunity component', () => {
  it('renders correctly', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    useMenuController.setState((state) => {
      state.data = listDiscoverCommunities;
      return state;
    });

    const rendered = renderWithRedux(<MenuDiscoverCommunity />);
    const { getByTestId } = rendered;
    const component = getByTestId('menu_discover_community');
    expect(component).toBeDefined();

    const item = getByTestId('menu_discover_community.item_btn_0');
    fireEvent.press(item);
    expect(navigate).toBeCalled();
  });
  it('renders JoinedCommunityPlaceholder', () => {
    useMenuController.setState((state) => {
      state.loading = true;
      state.data = undefined;
      return state;
    });

    const rendered = renderWithRedux(<MenuDiscoverCommunity />);
    const { getByTestId } = rendered;
    const component = getByTestId('joined_community_placeholder');
    expect(component).toBeDefined();
  });
});
