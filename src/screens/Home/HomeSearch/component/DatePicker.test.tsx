import React from 'react';

import { render } from '~/test/testUtils';
import DatePicker from './DatePicker';

describe('DatePicker component', () => {
  const props = {
    selectingStartDate: true,
    selectingEndDate: true,
    selectedStartDate: 'test',
    selectedEndDate: 'test',
    onChangeDatePicker: jest.fn(),
  };
  it('renders correctly', () => {
    const rendered = render(<DatePicker {...props} />);
    const { getByTestId } = rendered;
    const containerView = getByTestId('date_picker');
    expect(containerView).toBeDefined();
  });
});
