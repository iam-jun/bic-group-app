import React from 'react';

import { fireEvent, languages, renderWithRedux } from '~/test/testUtils';
import MockedNavigator from '~/test/MockedNavigator';
import PrivacyCenter from './index';
import * as navigationHook from '~/hooks/navigation';
import menuStack from '~/router/navigator/MainStack/stacks/menuStack/stack';

describe('PrivacyCenter', () => {
  it('should render correctly', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <PrivacyCenter />
        )}
      />,
    );

    const headerTitle = wrapper.getByTestId('header.text');
    expect(headerTitle.props.children).toBe(languages.settings.privacy_center.screen_title);

    const personalInfoVisibility = wrapper.getByTestId('privacy_center.personal_information_visibility');
    expect(personalInfoVisibility).toBeDefined();

    fireEvent.press(personalInfoVisibility);
    expect(navigate).toBeCalledWith(menuStack.personalInfoVisibility);
  });
});
