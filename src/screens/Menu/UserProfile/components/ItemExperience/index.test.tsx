import { render } from '@testing-library/react-native';
import * as React from 'react';

import ItemExperience from '.';

describe('ItemExperience component', () => {
  const baseProps = {
    id: '1',
    company: 'company',
    titlePosition: 'titlePosition',
    startDate: '2022-03-07T07:58:05.436Z',
    currentlyWorkHere: true,
    endDate: null,
    location: 'location',
  };

  it('renders correctly', () => {
    const rendered = render(<ItemExperience {...baseProps} />).toJSON();
    expect(rendered).toMatchSnapshot();
  });
});
