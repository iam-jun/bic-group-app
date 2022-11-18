import * as React from 'react';
import { render, cleanup } from '@testing-library/react-native';

import InfoCard from '.';

describe('InfoSection component', () => {
  const baseProps = {
    title: 'title',
    children: null,
  };

  afterEach(cleanup);

  it('renders correctly', () => {
    const rendered = render(<InfoCard {...baseProps} />).toJSON();
    expect(rendered).toMatchSnapshot();
  });
});
