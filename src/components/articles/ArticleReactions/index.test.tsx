import React from 'react';

import {
  createTestStore,
  renderWithRedux,
} from '~/test/testUtils';
import { IPost } from '~/interfaces/IPost';
import ArticleReactions from '.';
import { mockArticle } from '~/test/mock_data/article';
import initialState from '~/storeRedux/initialState';

describe('ArticleReactions Component', () => {
  const state = { ...initialState };
  const article = mockArticle as IPost;

  it('renders correctly', () => {
    const store = createTestStore(state);

    const rendered = renderWithRedux(
      <ArticleReactions
        ownerReactions={article.ownerReactions}
        reactionsCount={article.reactionsCount}
      />, store,
    );
    expect(rendered).toMatchSnapshot();
  });
});
