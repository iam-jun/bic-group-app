import * as React from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react-native';

import ChangePrivacy from './ChangePrivacy';
import useGeneralInformationStore, { TypePrivacyImpact } from '../store';

afterEach(cleanup);

describe('ChangePrivacy component', () => {
  it('renders case membership approval correctly', () => {
    useGeneralInformationStore.setState((state) => {
      state.affectedInnerGroupsMembershipApproval = [{ id: '1', name: 'test' }];
      state.typePrivacyImpact = TypePrivacyImpact.MEMBERSHIP_APPROVAL;
      return state;
    });

    const props = {
      onChange: jest.fn(),
    };
    const rendered = render(<ChangePrivacy {...props} />);

    const { getByTestId } = rendered;

    const btnShowMore = getByTestId('change_privacy.btn_show_more');
    fireEvent.press(btnShowMore);

    const containerView = getByTestId('change_privacy.membership_approval');
    expect(containerView).toBeDefined();
  });

  it('renders case badge correctly', () => {
    useGeneralInformationStore.setState((state) => {
      state.badge = { id: '1', name: 'test', iconUrl: 'test' };
      state.typePrivacyImpact = TypePrivacyImpact.BADGE;
      return state;
    });

    const props = {
      onChange: jest.fn(),
    };
    const rendered = render(<ChangePrivacy {...props} />);

    const { getByTestId } = rendered;

    const containerView = getByTestId('change_privacy.badge');
    expect(containerView).toBeDefined();
  });
});
