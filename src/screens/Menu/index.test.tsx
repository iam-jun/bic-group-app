import React from 'react';

import { fireEvent, renderWithRedux } from '~/test/testUtils';
import Menu from './index';
import * as navigationHook from '~/hooks/navigation';
import menuStack from '~/router/navigator/MainStack/stacks/menuStack/stack';
import { responseGetUserProfile } from './UserProfile/store/__mocks__/data';
import userApi from '~/api/UserApi';

describe('Menu screen', () => {
  it('should render correctly', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest
      .spyOn(navigationHook, 'useRootNavigation')
      .mockImplementation(() => ({ rootNavigation } as any));

    jest
      .spyOn(userApi, 'getUserProfile')
      .mockImplementation(() => Promise.resolve(responseGetUserProfile) as any);

    const rendered = renderWithRedux(<Menu />);

    const containerComponent = rendered.queryByTestId('MenuScreen');
    expect(containerComponent).toBeDefined();

    const menuDiscoverCommunity = rendered.getByTestId(
      'menu_discover_community',
    );
    expect(menuDiscoverCommunity).toBeDefined();

    // should navigate to discover screen
    const buttonDiscover = rendered.getByTestId('menu_screen.button_discover');
    fireEvent.press(buttonDiscover);
    expect(navigate).toHaveBeenCalledWith(menuStack.discover);

    const menuShortcut = rendered.getByTestId('menu_shortcut');
    expect(menuShortcut).toBeDefined();

    const menuSettings = rendered.getByTestId('menu_settings');
    expect(menuSettings).toBeDefined();
  });
});
