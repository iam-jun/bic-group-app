import React from 'react';

import { createTestStore, fireEvent, renderWithRedux } from '../../test/testUtils';
import initialState from '../../storeRedux/initialState';
import Home from './index';
import MockedNavigator from '../../test/MockedNavigator';
import homeActions from '../../storeRedux/home/actions';
import homeTypes from '../../storeRedux/home/types';
import { POST_DETAIL } from '../../test/mock_data/post';
import * as linkUtil from '../../utils/link';

describe('Home screen', () => {
  const user = { signInUserSession: { idToken: { jwtToken: 'jwt' } } };
  const baseStore = { ...initialState };
  baseStore.auth.user = user as any;
  jest.useFakeTimers();

  it('should render Home list when have data', async () => {
    const storeData = { ...baseStore } as any;

    const mockActionGetHomePosts = () => ({
      type: homeTypes.SET_HOME_POSTS,
      payload: [POST_DETAIL, POST_DETAIL],
    });
    jest
      .spyOn(homeActions, 'getHomePosts')
      .mockImplementation(mockActionGetHomePosts as any);

    const store = createTestStore(storeData);
    const wrapper = renderWithRedux(
      <MockedNavigator component={Home} />,
      store,
    );
    const newsfeedList = wrapper.queryByTestId('newsfeed_list.list');
    expect(newsfeedList).not.toBeNull();
  });

  it('should call open chat', () => {
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

  // it(`should not render newsfeed list when have data`, async () => {
  //   const storeData = {...baseStore} as any;
  //
  //   const mockActionGetHomePosts = () => ({
  //     type: homeTypes.SET_HOME_POSTS,
  //     payload: [],
  //   });
  //   jest
  //     .spyOn(homeActions, 'getHomePosts')
  //     .mockImplementation(mockActionGetHomePosts as any);
  //
  //   const store = createTestStore(storeData);
  //   const wrapper = renderWithRedux(
  //     <MockedNavigator component={Newsfeed} />,
  //     store,
  //   );
  //   const newsfeedList = wrapper.queryByTestId('newsfeed_list.list');
  //   expect(newsfeedList).toBeNull();
  // });
});
