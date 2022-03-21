import React from 'react';

import {
  createTestStore,
  fireEvent,
  renderWithRedux,
  waitForUpdateRedux,
} from '~/test/testUtils';
import initialState from '~/store/initialState';
import CreatePost from '.';
import {GROUP_AUDIENCE} from '~/test/mock_data/post';
import * as navigationHook from '~/hooks/navigation';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';

describe('Create Post screen', () => {
  const navigate = jest.fn();
  const rootNavigation = {navigate};
  jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => {
    return {rootNavigation} as any;
  });

  it(`renders correctly with 1 audience selected, empty content, button post disabled`, async () => {
    const storeData = {...initialState};
    storeData.post.createPost.chosenAudiences = [GROUP_AUDIENCE] as any;
    const store = createTestStore(storeData);
    const wrapper = renderWithRedux(<CreatePost />, store);
    const btnPost = wrapper.getByTestId('create_post.btn_post');
    expect(btnPost.props?.accessibilityState?.disabled).toBe(true);
    expect(wrapper).toMatchSnapshot();
  });

  it(`should enable button post after change text content`, async () => {
    const storeData = {...initialState};
    storeData.post.createPost.chosenAudiences = [GROUP_AUDIENCE] as any;
    const store = createTestStore(storeData);
    const wrapper = renderWithRedux(<CreatePost />, store);
    const btnPost = wrapper.getByTestId('create_post.btn_post');
    expect(btnPost.props?.accessibilityState?.disabled).toBe(true);
    const input = wrapper.getByTestId('_mention_input.input');
    fireEvent.changeText(input, 'hello');
    await waitForUpdateRedux();
    expect(btnPost.props?.accessibilityState?.disabled).toBe(false);
  });

  it(`should navigate to screen post settings when press button settings`, async () => {
    const wrapper = renderWithRedux(<CreatePost />);
    const btnSettings = wrapper.getByTestId('create_post.btn_post_settings');
    fireEvent.press(btnSettings);
    expect(navigate).toBeCalledWith(homeStack.postSettings);
  });

  it(`should navigate to screen select audience when press chosen audience view`, async () => {
    const wrapper = renderWithRedux(<CreatePost />);
    const chosenAudienceView = wrapper.getByTestId(
      'create_post_chosen_audiences',
    );
    fireEvent.press(chosenAudienceView);
    expect(navigate).toBeCalledWith(homeStack.postSelectAudience);
  });
});
