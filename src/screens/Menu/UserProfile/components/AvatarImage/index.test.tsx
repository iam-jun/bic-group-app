import React from 'react';

import { renderWithRedux } from '~/test/testUtils';
import AvatarImage from '.';

describe('AvatarImage component', () => {
  const baseProps = {
    isCurrentUser: true,
    avatar: null,
    onEdit: jest.fn(),
  };

  it('renders correctly', () => {
    const rendered = renderWithRedux(<AvatarImage {...baseProps} />);
    const { getByTestId } = rendered;
    const containerComponent = getByTestId('user_profile.avatar_image');
    expect(containerComponent).toBeDefined();
  });
});
