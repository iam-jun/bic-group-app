import React from 'react';

import {
  render,
} from '~/test/testUtils';
import ArticlePlaceholder from '.';

describe('ArticlePlaceholder Component', () => {
  it('renders correctly', () => {
    const rendered = render(
      <ArticlePlaceholder />,
    );
    expect(rendered).toMatchSnapshot();
  });
});
