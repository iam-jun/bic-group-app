import React from 'react';

import { renderWithRedux } from '~/test/testUtils';
import ArticleScheduleContent from './index';

describe('ArticleScheduleContent screen', () => {
  const props = { route: { params: { groupId: '123' } } };

  it('render correctly', () => {
    const rendered = renderWithRedux(
      <ArticleScheduleContent {...props} />,
    );

    const containerView = rendered.queryByTestId('article_schedule_content');
    expect(containerView).not.toBeNull();
  });
});
