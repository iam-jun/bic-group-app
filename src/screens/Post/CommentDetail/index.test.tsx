import React from 'react';

import {createTestStore, renderWithRedux} from '~/test/testUtils';
import initialState from '~/store/initialState';
import CommentDetail from '.';
import {baseCommentData} from '~/test/mock_data/post';
import MockedNavigator from '~/test/MockedNavigator';
import i18next from 'i18next';

describe('Comment Detail screen', () => {
  const props = {
    route: {
      params: {
        commentData: baseCommentData,
        postId: 302,
        replyItem: undefined,
        commentParent: undefined,
      },
    },
  };

  it('should render correctly title', () => {
    const store = createTestStore({...initialState});
    const wrapper = renderWithRedux(
      <MockedNavigator component={() => <CommentDetail {...props} />} />,
      store,
    );
    const headerTitle = wrapper.getByTestId('header.text');
    expect(headerTitle).toBeDefined();

    expect(headerTitle.props?.children).toBe(i18next.t('post:label_comment'));
  });
});
