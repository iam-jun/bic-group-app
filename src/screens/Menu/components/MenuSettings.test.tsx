import React from 'react';

import { Linking } from 'react-native';
import { fireEvent, render, renderWithRedux } from '~/test/testUtils';
import MenuSettings from './MenuSettings';
import * as navigationHook from '~/hooks/navigation';
import menuStack from '~/router/navigator/MainStack/stacks/menuStack/stack';
import useCommonController from '~/screens/store';
import useAppStore from '~/store/app';
import useModalStore from '~/store/modal';

describe('MenuSettings component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const showAlert = jest.fn();
    useModalStore.setState((state) => {
      state.actions = { showAlert } as any;
      return state;
    });
    const rendered = render(<MenuSettings />);

    const buttonLogout = rendered.getByTestId('menu_setting.logout');
    expect(buttonLogout).toBeDefined();

    fireEvent.press(buttonLogout);
    expect(showAlert).toBeCalled();
  });

  it('should navigate to account setting screen when click item Settings & privacy', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const rendered = render(<MenuSettings />);
    const itemsComponent = rendered.getAllByTestId('menu_setting.item');
    expect(itemsComponent).toBeDefined();
    expect(itemsComponent.length).toEqual(2);

    expect(itemsComponent[0]).toBeDefined();
    fireEvent.press(itemsComponent[0]);
    expect(navigate).toHaveBeenCalledWith(menuStack.accountSettings);
  });

  it('should open link when click item Report a problem', () => {
    const openURL = jest.fn();
    jest.spyOn(Linking, 'openURL').mockImplementation(openURL);

    const rendered = render(<MenuSettings />);
    const itemsComponent = rendered.getAllByTestId('menu_setting.item');
    expect(itemsComponent).toBeDefined();
    expect(itemsComponent.length).toEqual(2);

    expect(itemsComponent[1]).toBeDefined();
    fireEvent.press(itemsComponent[1]);
    expect(openURL).toHaveBeenCalled();
  });

  it('should show debug if isShowDebug', () => {
    const setDebuggerVisible = jest.fn();
    useCommonController.setState((state) => {
      state.myProfile = { email: 'namanh@evolgroup.vn' } as any;
      return state;
    });

    useAppStore.setState((state) => {
      state.actions.setDebuggerVisible = setDebuggerVisible;
      return state;
    });

    const rendered = renderWithRedux(<MenuSettings />);
    const itemsComponent = rendered.getAllByTestId('menu_setting.item');
    expect(itemsComponent).toBeDefined();
    expect(itemsComponent.length).toEqual(3);

    expect(itemsComponent[2]).toBeDefined();
    fireEvent.press(itemsComponent[2]);

    expect(setDebuggerVisible).toBeCalled();
  });
});
