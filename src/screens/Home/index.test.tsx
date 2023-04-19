import React from 'react';
import { act } from 'react-test-renderer';
import useAuthController, { IAuthState } from '~/screens/auth/store';

import {
  createTestStore, fireEvent, render, renderWithRedux,
} from '~/test/testUtils';
import initialState from '../../storeRedux/initialState';
import Home from '.';
import MockedNavigator from '../../test/MockedNavigator';
import * as linkUtil from '../../utils/link';
import useHomeStore from './store';
import useAppStore from '~/store/app';
import useFeedSearchStore from './HomeSearch/store';

describe('Home screen', () => {
  it('should call open chat', async () => {
    const user = { signInUserSession: { idToken: { jwtToken: 'jwt' } }, userId: 'test' };
    const baseStore = { ...initialState };
    useAuthController.setState((state: IAuthState) => {
      state.authUser = user as any;
      return state;
    });
    jest.useFakeTimers();

    useAppStore.setState((state) => {
      state.redirectUrl = 'test';
      return state;
    });

    const setNewsfeedSearch = jest.fn();
    useFeedSearchStore.setState((state) => {
      state.actions.setNewsfeedSearch = setNewsfeedSearch;
      return state;
    });

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

    const btnSearch = wrapper.getByTestId('home_header_button.btn_search');
    fireEvent.press(btnSearch);
    expect(setNewsfeedSearch).toBeCalled();
  });

  it('default render should contentFilter = ALL vs attributeFilter = ALL', () => {
    const wrapper = renderWithRedux(
      <MockedNavigator component={Home} />,
    );

    const tabContentFilterAll = wrapper.getByTestId('tab-button-home:title_feed_content_all-selected');
    const tabAttributeFilterAll = wrapper.getByTestId('tab-button-home:title_feed_attritube_all-selected');

    expect(tabContentFilterAll).toBeDefined();
    expect(tabAttributeFilterAll).toBeDefined();
  });

  it('should onRefresh', async () => {
    const getDataFeed = jest.fn();
    useHomeStore.setState((state) => {
      state.actions.getDataFeed = getDataFeed;
      state.feed.ALL.ALL.data = ['test'];
      return state;
    });

    const wrapper = render(<MockedNavigator component={Home} />);

    const list = wrapper.getByTestId('newsfeed_list.list');
    expect(list).toBeDefined();
    const { refreshControl } = list.props;

    act(async () => {
      refreshControl.props.onRefresh();
    });
    expect(getDataFeed).toBeCalled();
  });
});
