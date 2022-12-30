import React from 'react';

import { act, renderWithRedux } from '~/test/testUtils';
import EditCover from '.';
import { mockArticle } from '~/test/mock_data/article';
import MockedNavigator from '~/test/MockedNavigator';
import usePostsStore from '~/store/entities/posts';
import { IPost } from '~/interfaces/IPost';

describe('CreateArticleCover', () => {
  it('should render correctly if cover is empty', () => {
    const article = { ...mockArticle };
    article.coverMedia = null;

    act(() => {
      usePostsStore.getState().actions.addToPosts({ data: article as IPost });
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <EditCover
            articleId={article.id}
          />
        )}
      />,
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly if cover is not empty', () => {
    act(() => {
      usePostsStore.getState().actions.addToPosts({ data: mockArticle as IPost });
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <EditCover
            articleId={mockArticle.id}
          />
        )}
      />,
    );

    expect(wrapper).toMatchSnapshot();
  });
});
