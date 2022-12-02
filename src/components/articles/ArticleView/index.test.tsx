import React from 'react';

import {
  act,
  createTestStore,
  renderHook,
  renderWithRedux,
} from '~/test/testUtils';
import { IPost } from '~/interfaces/IPost';
import ArticleView from '.';
import { mockArticle } from '~/test/mock_data/article';
import initialState from '~/storeRedux/initialState';
import usePostsStore from '~/store/entities/posts';

describe('ArticleView Component', () => {
  const state = { ...initialState };
  const article = mockArticle as IPost;

  it('renders correctly', () => {
    const store = createTestStore(state);

    const rendered = renderWithRedux(
      <ArticleView
        id={article.id}
        article={article}
        firstCommentId=""
      />, store,
    );
    expect(rendered).toMatchSnapshot();
  });

  it('should hide LoadMoreComment', () => {
    const store = createTestStore(state);

    const { result } = renderHook(() => usePostsStore());

    act(() => {
      result.current.actions.addToPosts({
        data: { ...article, comments: { meta: { hasNextPage: false } } },
      });
    });

    const rendered = renderWithRedux(
      <ArticleView
        id={article.id}
        article={article}
        firstCommentId=""
      />, store,
    );

    const loadMoreComment = rendered.queryByTestId('article_view.load_more_comment');
    expect(loadMoreComment).toBeNull();
  });

  it('should show LoadMoreComment', () => {
    const store = createTestStore(state);

    const { result } = renderHook(() => usePostsStore());

    act(() => {
      result.current.actions.addToPosts({
        data: { ...article, comments: { meta: { hasNextPage: true } } },
      });
    });

    const rendered = renderWithRedux(
      <ArticleView
        id={article.id}
        article={article}
        firstCommentId=""
      />, store,
    );

    const loadMoreComment = rendered.queryByTestId('article_view.load_more_comment');
    expect(loadMoreComment).not.toBeNull();
  });
});
