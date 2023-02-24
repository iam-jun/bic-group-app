import React from 'react';

import { fireEvent, renderWithRedux } from '~/test/testUtils';
import CheckUpdate from './CheckUpdate';

describe('CheckUpdate component', () => {
  it('renders correctly', () => {
    const rendered = renderWithRedux(<CheckUpdate />);
    const { getByTestId } = rendered;
    const btn = getByTestId('check_update');
    expect(btn).toBeDefined();
    fireEvent.press(btn);
  });
});
