/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';

import { render } from '~/test/testUtils';
import { mockGroupedInvitations, mockInvitationData } from '~/test/mock_data/invitations';
import useMyInvitationsStore, { IMyInvitationsStore } from '../store';
import { MockedAppContext } from '~/test/MockedAppContext';
import InvitationBlock from './InvitationBlock';

describe('InvitationBlock component', () => {
  it('should render correctly', () => {
    useMyInvitationsStore.setState((state: IMyInvitationsStore) => {
      state.hasNextPage = false;
      state.groupedInvitations = mockGroupedInvitations;
      state.invitationData = mockInvitationData as any;
      state.requestingsAccept = {};
      state.requestingsDecline = {};
      return state;
    });

    const values = { useMyInvitationsStore };

    const wrapper = render(
      <MockedAppContext.Provider value={values}>
        <InvitationBlock
          data={mockGroupedInvitations[0]}
        />
      </MockedAppContext.Provider>,
    );

    const titleComponent = wrapper.getByTestId('invitation_block.header_title');
    expect(titleComponent).toBeDefined();

    const listComponent = wrapper.getByTestId('invitation_block.list_invitation');
    expect(listComponent).toBeDefined();

    const listComponentItems = wrapper.getAllByTestId('invitation_item.container');
    expect(listComponentItems.length).toBe(mockGroupedInvitations[0].data.length);
  });

  it('should render null if data is empty', () => {
    useMyInvitationsStore.setState((state: IMyInvitationsStore) => {
      state.hasNextPage = false;
      state.groupedInvitations = mockGroupedInvitations;
      state.invitationData = mockInvitationData as any;
      state.requestingsAccept = {};
      state.requestingsDecline = {};
      return state;
    });

    const values = { useMyInvitationsStore };

    const wrapper = render(
      <MockedAppContext.Provider value={values}>
        <InvitationBlock
          data={{ id: 1, title: '1', data: [] }}
        />
      </MockedAppContext.Provider>,
    );

    const listComponent = wrapper.queryByTestId('invitation_block.list_invitation');
    expect(listComponent).toBeNull();
  });
});
