import { render } from '@testing-library/react-native';
import * as React from 'react';

import WorkInfo from '.';

describe('WorkInfo component', () => {
  const baseProps = {
    latestWork: {
      titlePosition: 'titlePosition',
      company: 'company',
    },
  }

  it('renders correctly', () => {
    const rendered = render(<WorkInfo {...baseProps} />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('renders null', () => {
    const rendered = render(<WorkInfo latestWork={null} />).toJSON();
    expect(rendered).toMatchSnapshot();
  });
});
