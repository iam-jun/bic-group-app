import React from 'react';
import { render } from '~/test/testUtils';
import { ArticleTitle, ArticleSummary } from '.';

describe('ArticleItem Component', () => {
  it('renders correctly', () => {
    const title = render(<ArticleTitle text="==title== ==highlight==" />);
    const componentTitle = title.getByTestId('article_text.title');
    expect(componentTitle).toBeDefined();

    const summary = render(<ArticleSummary text="==title== ==highlight==" />);
    const componentSummary = summary.getByTestId('article_text.summary');
    expect(componentSummary).toBeDefined();
  });
});
