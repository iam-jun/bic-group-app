import { render } from '@testing-library/react-native';
import * as React from 'react';

import Contact from '.';

describe('Contact component', () => {
  const baseProps = {
    email: 'email',
    phone: 'phone',
    country: 'country',
    city: 'city',
  }

  it('renders correctly', () => {
    const rendered = render(<Contact {...baseProps} />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('renders location Not set', () => {
    const props = { ...baseProps, city: '' }
    const rendered = render(<Contact {...props} />).toJSON();
    expect(rendered).toMatchSnapshot();
  });
});
