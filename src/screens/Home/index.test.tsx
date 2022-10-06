import React from 'react';

import { createTestStore, fireEvent, renderWithRedux } from '~/test/testUtils';
import initialState from '../../storeRedux/initialState';
import Home from './index';
import MockedNavigator from '../../test/MockedNavigator';
import * as linkUtil from '../../utils/link';

describe('Home screen', () => {
  const user = { signInUserSession: { idToken: { jwtToken: 'jwt' } } };
  const baseStore = { ...initialState };
  baseStore.auth.user = user as any;
  jest.useFakeTimers();

  it('should call open chat', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const spy = jest.spyOn(linkUtil, 'openUrl').mockImplementation(() => {});
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
});
