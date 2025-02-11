import React from 'react';

import { Linking } from 'react-native';
import { fireEvent, render, renderWithRedux } from '~/test/testUtils';
import MenuSettings from './MenuSettings';
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

  it('should open link when click item Report a problem', () => {
    const openURL = jest.fn();
    jest.spyOn(Linking, 'openURL').mockImplementation(openURL);

    const rendered = render(<MenuSettings />);
    const itemsComponent = rendered.getAllByTestId('menu_setting.item');
    expect(itemsComponent).toBeDefined();
    expect(itemsComponent.length).toEqual(3);

    expect(itemsComponent[2]).toBeDefined();
    fireEvent.press(itemsComponent[2]);
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
    expect(itemsComponent.length).toEqual(4);

    expect(itemsComponent[3]).toBeDefined();
    fireEvent.press(itemsComponent[3]);
    expect(setDebuggerVisible).toBeCalled();
  });
});
