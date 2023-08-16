import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import InvitationView from './index';
import { ITypeGroup } from '~/interfaces/common';
import { communityDetailDataWithInvitation } from '~/test/mock_data/communities';
import useNotiInvitationsStore from '~/screens/Notification/components/NotificationItem/store';

describe('InvitationView', () => {
  const props = {
    data: communityDetailDataWithInvitation.invitation,
    type: ITypeGroup.COMMUNITY,
    communityId: 'test',
    groupId: '',
  };

  it('renders correctly with decline', () => {
    const declineSingleInvitation = jest.fn();
    useNotiInvitationsStore.setState((state) => {
      state.actions.declineSingleInvitation = declineSingleInvitation;
      return state;
    });

    const { getByTestId } = render(<InvitationView {...props} />);
    const buttonDecline = getByTestId('button_approve_decline_all_requests.decline');
    fireEvent.press(buttonDecline);
    expect(declineSingleInvitation).toBeCalled();
  });

  it('renders correctly with accept', () => {
    const acceptSingleInvitation = jest.fn();
    useNotiInvitationsStore.setState((state) => {
      state.actions.acceptSingleInvitation = acceptSingleInvitation;
      return state;
    });

    const { getByTestId } = render(<InvitationView {...props} />);
    const buttonAccept = getByTestId('button_approve_decline_all_requests.accept');
    fireEvent.press(buttonAccept);
    expect(acceptSingleInvitation).toBeCalled();
  });
});
