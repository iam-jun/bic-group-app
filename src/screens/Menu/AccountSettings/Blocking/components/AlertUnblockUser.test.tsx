import React from 'react';

import { renderWithRedux } from '~/test/testUtils';
import AlertUnblockUser from './AlertUnblockUser';

describe('AlertUnblockUser component', () => {
  it('renders correctly', () => {
    const rendered = renderWithRedux(<AlertUnblockUser />);
    const { getByTestId } = rendered;
    const containerComponent = getByTestId('alert_unblock_user');
    expect(containerComponent).toBeDefined();
  });
});
