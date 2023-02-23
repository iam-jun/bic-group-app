import React from 'react';

import { renderWithRedux } from '~/test/testUtils';
import JoinedCommunityPlaceholder from './JoinedCommunityPlaceholder';

describe('JoinedCommunityPlaceholder component', () => {
  it('renders correctly', () => {
    const rendered = renderWithRedux(<JoinedCommunityPlaceholder />);
    const { getByTestId } = rendered;
    const component = getByTestId('joined_community_placeholder');
    expect(component).toBeDefined();
  });
});
