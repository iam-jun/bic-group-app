import React from 'react';

import { render } from '~/test/testUtils';
import LogoImage from './LogoImage';

describe('LogoImage component', () => {
  it('renders correctly', () => {
    const rendered = render(<LogoImage />);
    const { getByTestId } = rendered;
    const component = getByTestId('logo_image');
    expect(component).toBeDefined();
  });
});
