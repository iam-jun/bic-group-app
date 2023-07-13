import React from 'react';

import { render } from '~/test/testUtils';
import GroupInfo from './GroupInfo';

describe('GroupInfo component', () => {
  const baseProps = {
    name: 'test',
    icon: 'test',
    privacy: 'test',
    userCount: 1,
  };

  it('renders correctly', () => {
    const rendered = render(<GroupInfo {...baseProps} />);
    const { getByTestId } = rendered;
    const containerComponent = getByTestId('group_info');
    expect(containerComponent).toBeDefined();
  });
});
