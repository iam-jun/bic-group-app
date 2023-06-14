import * as React from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react-native';

import { cloneDeep } from 'lodash';
import MembershipApproval from './MembershipApproval';
import { groupDetailData } from '~/test/mock_data/communities';
import { GroupPrivacyType } from '~/constants/privacyTypes';

afterEach(cleanup);

describe('MembershipApproval component', () => {
  const props = {
    data: groupDetailData.group,
    updateJoinSetting: jest.fn(),
  };

  it('renders correctly', () => {
    const propsClone = cloneDeep(props);
    propsClone.data.privacy = GroupPrivacyType.OPEN;

    const rendered = render(<MembershipApproval {...propsClone} />);

    const { getByTestId } = rendered;
    const containerView = getByTestId('membership_approval');
    expect(containerView).toBeDefined();

    const toggle = getByTestId('membership_approval.toggle');
    fireEvent.press(toggle);
    expect(propsClone.updateJoinSetting).toHaveBeenCalled();
  });

  it('renders null with privacy = SECRET', () => {
    const propsClone = cloneDeep(props);
    propsClone.data.privacy = GroupPrivacyType.SECRET;

    const rendered = render(<MembershipApproval {...propsClone} />);

    const { queryByTestId } = rendered;
    const containerView = queryByTestId('membership_approval');
    expect(containerView).toBeNull();
  });
});
