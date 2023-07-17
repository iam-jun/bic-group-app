import * as React from 'react';
import {
  cleanup, fireEvent, render, waitFor,
} from '@testing-library/react-native';

import MembershipPolicySettings from './index';
import { ITypeGroup } from '~/interfaces/common';
import groupApi from '~/api/GroupApi';
import { previewSettingsResponse } from '~/test/mock_data/group';
import useModalStore from '~/store/modal';

afterEach(cleanup);

describe('MembershipPolicySettings component', () => {
  it('renders correctly with community', async () => {
    const props = {
      route: { params: { groupId: 'test', type: ITypeGroup.COMMUNITY } },
    };

    const rendered = render(<MembershipPolicySettings {...props} />);

    jest.spyOn(groupApi, 'previewSettings').mockImplementation(() => Promise.resolve(previewSettingsResponse) as any);

    const showModal = jest.fn();
    useModalStore.setState((state) => {
      state.actions.showModal = showModal;
      return state;
    });

    const { getByTestId } = rendered;
    const containerView = getByTestId('membership_policy_settings');
    const toggle = getByTestId('membership_approval.toggle');
    expect(containerView).toBeDefined();

    await waitFor(() => {
      fireEvent.press(toggle);
      expect(showModal).toBeCalled();
    });
  });

  it('renders correctly with group', () => {
    const props = {
      route: { params: { groupId: 'test', type: ITypeGroup.GROUP } },
    };
    const rendered = render(<MembershipPolicySettings {...props} />);

    const { getByTestId } = rendered;
    const containerView = getByTestId('membership_policy_settings');
    expect(containerView).toBeDefined();
  });
});
