import React from 'react';

import {createTestStore, renderWithRedux} from '~/test/testUtils';
import initialState from '~/store/initialState';
import PostDetail from '~/screens/Post/PostDetail/index';
import {POST_DETAIL} from '~/test/mock_data/post';
import {USER_PROFILE} from '~/test/mock_data/menu';
import MockedNavigator from '~/test/MockedNavigator';

describe('PostDetail screen', () => {
  const props = {route: {params: {post_id: POST_DETAIL.id}}};
  let storeData: any;

  beforeEach(() => {
    jest.clearAllMocks();
    storeData = {
      ...initialState,
      ...{
        post: {allPosts: {[POST_DETAIL.id]: POST_DETAIL}},
        noInternet: {isInternetReachable: true},
        auth: {
          user: {
            signInUserSession: {
              idToken: {payload: {'custom:user_uuid': USER_PROFILE.id}},
            },
          },
        },
      },
    } as any;
  });

  it('should render placeholder', () => {
    const store = createTestStore({...initialState});
    const wrapper = renderWithRedux(
      <MockedNavigator component={() => <PostDetail {...props} />} />,
      store,
    );
    const postViewPlaceholder = wrapper.queryByTestId(
      'post_detail.post_view_placeholder',
    );
    expect(postViewPlaceholder).not.toBeNull();
  });
});
