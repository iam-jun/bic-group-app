import React from 'react';
import usePostsStore from '~/store/entities/posts';
import initialState from '~/storeRedux/initialState';
import MockedNavigator from '~/test/MockedNavigator';
import { POST_DETAIL } from '~/test/mock_data/post';

import { createTestStore, fireEvent, renderWithRedux } from '~/test/testUtils';
import PostDetailContent from './index';

describe('PostDetailContent component', () => {
  it('render correctly with isReported = true', () => {
    usePostsStore.setState((state) => {
      state.posts = {
        [POST_DETAIL.id]: POST_DETAIL as any,
      };
      return state;
    });
    const store = createTestStore({ ...initialState });
    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <PostDetailContent
            route={{
              params: {
                post_id: POST_DETAIL.id,
                focus_comment: 'test',
                noti_id: 'test',
                is_reported: true,
              },
            }}
          />
        )}
      />,
      store,
    );
    const { getByTestId } = wrapper;
    const postView = getByTestId('post_detail_content');
    expect(postView).toBeDefined();
  });

  it('render correctly with isReported = false', () => {
    usePostsStore.setState((state) => {
      state.posts = {
        [POST_DETAIL.id]: POST_DETAIL as any,
      };
      return state;
    });
    const store = createTestStore({ ...initialState });
    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <PostDetailContent
            route={{
              params: {
                post_id: POST_DETAIL.id,
                focus_comment: 'test',
                noti_id: 'test',
                is_reported: false,
              },
            }}
          />
        )}
      />,
      store,
    );
    const { getByTestId } = wrapper;
    const postView = getByTestId('post_detail_content');
    expect(postView).toBeDefined();

    const btnBack = getByTestId('header.back');
    fireEvent.press(btnBack);
    // can not call navigation, test back later
  });
});
