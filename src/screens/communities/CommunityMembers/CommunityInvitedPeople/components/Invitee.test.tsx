import React from 'react';
import { render } from '@testing-library/react-native';
import Invitee from './Invitee';
import { IInvitedPeople } from '~/interfaces/IGroup';
import { responseGetInvitations } from '~/test/mock_data/invitedPeople';

describe('Invitee', () => {
  it('renders correctly', () => {
    const item: IInvitedPeople = responseGetInvitations.data[0];

    const { getByTestId } = render(<Invitee item={item} />);
    expect(getByTestId('invitee')).toBeDefined();
  });
});
