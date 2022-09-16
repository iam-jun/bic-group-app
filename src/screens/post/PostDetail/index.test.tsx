import React from 'react';

import { createTestStore, renderWithRedux } from '~/test/testUtils';
import initialState from '~/storeRedux/initialState';
import PostDetail from '~/screens/post/PostDetail/index';
import { POST_DETAIL } from '~/test/mock_data/post';
import MockedNavigator from '~/test/MockedNavigator';

describe('PostDetail screen', () => {
  const props = { route: { params: { post_id: POST_DETAIL.id } } };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render placeholder', () => {
    const store = createTestStore({ ...initialState });
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
