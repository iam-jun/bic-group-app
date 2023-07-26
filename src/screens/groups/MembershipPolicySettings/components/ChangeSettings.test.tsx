import * as React from 'react';
import { cleanup, render } from '@testing-library/react-native';

import ChangeSettings from './ChangeSettings';

afterEach(cleanup);

describe('ChangeSettings component', () => {
  it('renders correctly', () => {
    const props = {
      isChangeMembershipApproval: true,
      name: 'test',
      updateJoinSetting: jest.fn(),
    };
    const rendered = render(<ChangeSettings {...props} />);

    const { getByTestId } = rendered;
    const containerView = getByTestId('change_settings');
    expect(containerView).toBeDefined();
  });
});
