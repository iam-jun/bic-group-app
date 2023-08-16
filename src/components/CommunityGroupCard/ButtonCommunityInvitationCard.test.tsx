import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import ButtonCommunityInvitationCard from './ButtonCommunityInvitationCard';
import useNotiInvitationsStore from '~/screens/Notification/components/NotificationItem/store';

describe('ButtonCommunityInvitationCard', () => {
  const props = {
    communityId: 'test',
    invitationId: 'test',
  };

  it('renders correctly with decline', () => {
    const declineSingleInvitation = jest.fn();
    useNotiInvitationsStore.setState((state) => {
      state.actions.declineSingleInvitation = declineSingleInvitation;
      return state;
    });

    const { getByTestId } = render(<ButtonCommunityInvitationCard {...props} />);
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

    const { getByTestId } = render(<ButtonCommunityInvitationCard {...props} />);
    const buttonAccept = getByTestId('button_approve_decline_all_requests.accept');
    fireEvent.press(buttonAccept);
    expect(acceptSingleInvitation).toBeCalled();
  });
});
