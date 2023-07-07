import * as React from 'react';
import { cleanup, render } from '@testing-library/react-native';

import CommunityAdmin from './index';

afterEach(cleanup);

describe('CommunityAdmin component', () => {
  it('renders correctly', () => {
    const props = {
      route: { params: { communityId: 'test' } },
    };
    const rendered = render(<CommunityAdmin {...props} />);

    const { getByTestId } = rendered;
    const containerView = getByTestId('CommunityAdmin');
    expect(containerView).toBeDefined();
  });
});
