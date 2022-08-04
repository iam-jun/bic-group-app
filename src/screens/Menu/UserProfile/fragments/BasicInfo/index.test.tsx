import { render } from '@testing-library/react-native';
import * as React from 'react';

import BasicInfo from '.';

describe('BasicInfo component', () => {
  const baseProps = {
    fullname: 'fullname',
    gender: 'MALE',
    birthday: '2022-03-07T07:58:05.436Z',
    language: ['en'],
    relationship: '',
  }

  it('renders correctly', () => {
    const rendered = render(<BasicInfo {...baseProps} />).toJSON();
    expect(rendered).toMatchSnapshot();
  });
});
