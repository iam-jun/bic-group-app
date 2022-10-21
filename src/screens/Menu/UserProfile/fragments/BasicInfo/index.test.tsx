import * as React from 'react';
import { renderWithRedux } from '~/test/testUtils';

import BasicInfo from '.';

describe('BasicInfo component', () => {
  const baseProps = {
    fullname: 'fullname',
    gender: 'MALE',
    birthday: '2022-03-07T07:58:05.436Z',
    language: ['en'],
    relationship: '',
    userId: '1',
    currentUsername: '1',
    isCurrentUser: true,
  };

  it('renders correctly', () => {
    const wrapper = renderWithRedux(<BasicInfo {...baseProps} />);
    expect(wrapper).toMatchSnapshot();
  });
});
