import * as React from 'react';
import { render, cleanup } from '@testing-library/react-native';

import InfoSection from '.';

describe('InfoSection component', () => {
  const baseProps = {
    title: 'title',
    children: null,
  }

  afterEach(cleanup);

  it('renders correctly', () => {
    const rendered = render(<InfoSection {...baseProps} />).toJSON();
    expect(rendered).toMatchSnapshot();
  });
});
