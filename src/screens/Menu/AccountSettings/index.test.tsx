import React from 'react';
import InAppBrowser from 'react-native-inappbrowser-reborn';

import { fireEvent, renderWithRedux } from '~/test/testUtils';
import AccoutSettings from './index';
import { accountSettingsMenu } from './constants';
import * as navigationHook from '~/hooks/navigation';
import menuStack from '~/router/navigator/MainStack/stacks/menuStack/stack';

describe('AccoutSettings screen', () => {
  it('should render correctly', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest
      .spyOn(navigationHook, 'useRootNavigation')
      .mockImplementation(() => ({ rootNavigation } as any));

    const spyInAppBrowser = jest.spyOn(InAppBrowser, 'isAvailable');

    const rendered = renderWithRedux(<AccoutSettings />);

    const containerComponent = rendered.queryByTestId('AccoutSettings');
    expect(containerComponent).toBeDefined();

    const itemsComponent = rendered.queryAllByTestId('account_settings');
    expect(itemsComponent).toBeDefined();
    expect(itemsComponent.length).toEqual(accountSettingsMenu.length);

    // should navigate to security & login screen
    const securityAndLoginCom = itemsComponent[0];
    fireEvent.press(securityAndLoginCom);
    expect(navigate).toHaveBeenCalledWith(menuStack.securityLogin);

    // should check open inappbrowser
    const privacy = itemsComponent[1];
    fireEvent.press(privacy);
    expect(spyInAppBrowser).toHaveBeenCalled();

    // should show bottom sheet when press item Language
    const languageCom = itemsComponent[2];
    fireEvent.press(languageCom);

    const bottomSheetCom = rendered.queryByTestId(
      'account_setting.bottom_sheet',
    );
    expect(bottomSheetCom).toBeDefined();
  });
});
