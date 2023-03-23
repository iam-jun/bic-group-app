import React from 'react';
import useAuthController, { IAuthState } from '~/screens/auth/store';

import {
  createTestStore, fireEvent, renderWithRedux,
} from '~/test/testUtils';
import initialState from '../../storeRedux/initialState';
import Home from '.';
import MockedNavigator from '../../test/MockedNavigator';
import * as linkUtil from '../../utils/link';

describe('Home screen', () => {
  it('should call open chat', () => {
    const user = { signInUserSession: { idToken: { jwtToken: 'jwt' } } };
    const baseStore = { ...initialState };
    useAuthController.setState((state:IAuthState) => {
      state.authUser = user as any;
      return state;
    });
    jest.useFakeTimers();

    const spy = jest.spyOn(linkUtil, 'openUrl').mockImplementation(jest.fn());
    const storeData = { ...baseStore } as any;
    const store = createTestStore(storeData);
    const wrapper = renderWithRedux(
      <MockedNavigator component={Home} />,
      store,
    );
    const btnChat = wrapper.getByTestId('icon_chat.button');
    fireEvent.press(btnChat);
    expect(spy).toBeCalled();
  }); // header.searchIcon.button

  it('default render should contentFilter = ALL vs attributeFilter = ALL', () => {
    const wrapper = renderWithRedux(
      <MockedNavigator component={Home} />,
    );

    const tabContentFilterAll = wrapper.getByTestId('tab-button-home:title_feed_content_all-selected');
    const tabAttributeFilterAll = wrapper.getByTestId('tab-button-home:title_feed_attritube_all-selected');

    expect(tabContentFilterAll).toBeDefined();
    expect(tabAttributeFilterAll).toBeDefined();
  });
});
