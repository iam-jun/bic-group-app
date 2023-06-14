import * as React from 'react';
import { cleanup, render } from '@testing-library/react-native';
import GroupAdministration from './GroupAdministration';

afterEach(cleanup);

describe('GroupAdministration component', () => {
  it('renders correctly', () => {
    const props = {
      route: { params: { groupId: 'test' } },
    };
    const rendered = render(<GroupAdministration {...props} />);

    const { getByTestId } = rendered;
    const containerView = getByTestId('GroupAdministration');
    expect(containerView).toBeDefined();
  });
});
