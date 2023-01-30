import React from 'react';

import { renderWithRedux } from '~/test/testUtils';
import { mockArticle } from '~/test/mock_data/article';
import ArticleReviewSchedule from './index';

describe('ArticleReviewSchedule screen', () => {
  const props = { route: { params: { articleId: mockArticle.id } } };

  it('render correctly', () => {
    const rendered = renderWithRedux(
      <ArticleReviewSchedule {...props} />,
    );

    const containerView = rendered.queryByTestId('article_review_schedule');
    expect(containerView).not.toBeNull();
  });
});
