import React from 'react';

import { render } from '~/test/testUtils';
import ArticlePlaceholder from '.';

describe('ArticlePlaceholder Component', () => {
  it('renders correctly', () => {
    const rendered = render(<ArticlePlaceholder />);
    const { getByTestId } = rendered;
    const component = getByTestId('article_placeholder');
    expect(component).toBeDefined();
  });
});
