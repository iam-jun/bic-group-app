import React from 'react';

import { createTestStore, fireEvent, renderWithRedux } from '~/test/testUtils';
import initialState from '~/store/initialState';
import Newsfeed from '.';
import MockedNavigator from '~/test/MockedNavigator';
import homeActions from '~/screens/Home/redux/actions';
import homeTypes from '~/screens/Home/redux/types';
import { POST_DETAIL } from '~/test/mock_data/post';
import * as commonUtil from '~/utils/common';

describe('Newsfeed screen', () => {
  const user = { signInUserSession: { idToken: { jwtToken: 'jwt' } } };
  const baseStore = { ...initialState };
  baseStore.auth.user = user as any;
  jest.useFakeTimers();

  it('should render newsfeed list when have data', async () => {
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
      <MockedNavigator component={Newsfeed} />,
      store,
    );
    const newsfeedList = wrapper.queryByTestId('newsfeed_list.list');
    expect(newsfeedList).not.toBeNull();
  });

  it('should call open chat', () => {
    const spy = jest.spyOn(commonUtil, 'openLink');
    const storeData = { ...baseStore } as any;
    const store = createTestStore(storeData);
    const wrapper = renderWithRedux(
      <MockedNavigator component={Newsfeed} />,
      store,
    );
    const btnChat = wrapper.getByTestId('header.iconChat');
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
