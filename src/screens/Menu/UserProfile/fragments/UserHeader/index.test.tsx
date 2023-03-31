import React from 'react';

import { renderWithRedux } from '~/test/testUtils';
import UserHeader from './index';

describe('UserHeader component', () => {
  it('renders correctly', () => {
    const fullname = 'test';
    const username = 'test';
    const latestWork = { company: 'Test', titlePosition: 'Test' };

    const rendered = renderWithRedux(<UserHeader
      id="123"
      fullname={fullname}
      username={username}
      latestWork={latestWork}
      isCurrentUser
    />);
    const { getByTestId } = rendered;
    const containerComponent = getByTestId('user_profile');
    expect(containerComponent).toBeDefined();
  });
});
