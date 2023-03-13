import React from 'react';

import { renderWithRedux } from '~/test/testUtils';
import DeactivatedView from '.';

describe('DeactivatedView component', () => {
  it('renders correctly', () => {
    const rendered = renderWithRedux(<DeactivatedView />);
    const { getByTestId } = rendered;
    const containerComponent = getByTestId('deactivated_view');
    expect(containerComponent).toBeDefined();
  });
});
