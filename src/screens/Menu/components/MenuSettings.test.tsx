import React from 'react';

import { Linking } from 'react-native';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import MenuSettings from './MenuSettings';
import modalActions from '~/storeRedux/modal/actions';
import appActions from '~/storeRedux/app/actions';
import * as navigationHook from '~/hooks/navigation';
import useModalStore from '~/store/modal';

describe('MenuSettings component', () => {
  it('renders correctly', () => {
    const showAlert = jest.fn();
    const actions = { showAlert };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const spyModal = jest.spyOn(modalActions, 'showAlertNewFeature');
    const spyApp = jest.spyOn(appActions, 'setDebuggerVisible');

    const rendered = renderWithRedux(<MenuSettings />);
    const { getByTestId } = rendered;
    const component = getByTestId('menu_settings');
    expect(component).toBeDefined();

    const displayAccessibility = getByTestId('menu_settings.item_BrightnessSolid');
    fireEvent.press(displayAccessibility);
    const billingPayment = getByTestId('menu_settings.item_CreditCardSolid');
    fireEvent.press(billingPayment);
    expect(spyModal).toBeCalled();

    const settingsPrivacy = getByTestId('menu_settings.item_FolderGear');
    fireEvent.press(settingsPrivacy);
    expect(navigate).toBeCalled();

    const helpSupport = getByTestId('menu_settings.item_MessagesQuestion');
    fireEvent.press(helpSupport);
    expect(spyApp).toBeCalled();

    const reportProblem = getByTestId('menu_settings.item_FlagSolid');
    fireEvent.press(reportProblem);
    expect(Linking.openURL).toBeCalled();
  });
});
