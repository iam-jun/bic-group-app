import React from 'react';
import {
  render,
} from '~/test/testUtils';
import { ArticleTitle, ArticleSummary } from '.';

describe('ArticleItem Component', () => {
  it('renders correctly', () => {
    const title = render(
      <ArticleTitle
        text="==title== ==highlight=="
      />,
    );
    expect(title).toMatchSnapshot();

    const summary = render(
      <ArticleSummary
        text="==title== ==highlight=="
      />,
    );
    expect(summary).toMatchSnapshot();
  });
});
