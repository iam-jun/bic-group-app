import React from 'react';
import ArticleReadingTime from '.';
import { renderWithRedux } from '~/test/testUtils';

describe('ArticleReadingTime component', () => {
  it('renders correctly', () => {
    const rendered = renderWithRedux(<ArticleReadingTime numberWords={500} />);

    const containerView = rendered.queryByTestId(
      'article_reading_time.content',
    );
    expect(containerView).toBeDefined();
  });

  it('renders correctly with numberWord < 200', () => {
    const rendered = renderWithRedux(<ArticleReadingTime numberWords={100} />);

    const containerView = rendered.queryByTestId(
      'article_reading_time.content',
    );
    expect(containerView).toBeDefined();
  });

  it('renders correctly with numberWord not a number', () => {
    const rendered = renderWithRedux(<ArticleReadingTime numberWords={'100' as any} />);

    const containerView = rendered.queryByTestId(
      'article_reading_time.content',
    );
    expect(containerView).toBeDefined();
  });
});
