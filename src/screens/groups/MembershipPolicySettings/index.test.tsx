import * as React from 'react';
import { cleanup, render } from '@testing-library/react-native';

import MembershipPolicySettings from './index';
import { ITypeGroup } from '~/interfaces/common';

afterEach(cleanup);

describe('MembershipPolicySettings component', () => {
  it('renders correctly', () => {
    const props = {
      route: { params: { id: 'test', type: ITypeGroup.COMMUNITY } },
    };
    const rendered = render(<MembershipPolicySettings {...props} />);

    const { getByTestId } = rendered;
    const containerView = getByTestId('membership_policy_settings');
    expect(containerView).toBeDefined();
  });
});
