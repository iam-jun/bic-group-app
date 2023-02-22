import React from 'react';

import { renderWithRedux } from '~/test/testUtils';
import CoverImage from '.';

describe('CoverImage component', () => {
  const baseProps = {
    isCurrentUser: true,
    bgImg: null,
    coverHeight: 120,
    onEdit: jest.fn(),
  };

  it('renders correctly', () => {
    const rendered = renderWithRedux(<CoverImage {...baseProps} />);
    const { getByTestId } = rendered;
    const containerComponent = getByTestId('user_profile.cover_image');
    expect(containerComponent).toBeDefined();
  });
});
