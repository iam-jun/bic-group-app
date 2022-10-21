import * as React from 'react';
import { renderWithRedux } from '~/test/testUtils';

import Contact from '.';

describe('Contact component', () => {
  const baseProps = {
    email: 'email',
    phone: 'phone',
    city: 'city',
    countryCode: '84',
    isCurrentUser: true,
  };

  it('renders correctly', () => {
    const rendered = renderWithRedux(<Contact {...baseProps} />);
    expect(rendered).toMatchSnapshot();
  });

  it('renders location Not set', () => {
    const props = { ...baseProps, city: '' };
    const wrapper = renderWithRedux(<Contact {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
