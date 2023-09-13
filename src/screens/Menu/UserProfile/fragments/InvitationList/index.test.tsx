/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';

import { fireEvent, render } from '~/test/testUtils';
import { mockGroupedInvitations, mockInvitationData, mockResposeListInvitation } from '~/test/mock_data/invitations';
import { MockedAppContext } from '~/test/MockedAppContext';
import InvitationList from './index';
import useMyInvitationsStore, { IMyInvitationsStore } from './store';
import * as navigationHook from '~/hooks/navigation';
import menuStack from '~/router/navigator/MainStack/stacks/menuStack/stack';

describe('InvitationList component', () => {
  it('should render correctly', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

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
        <InvitationList />
      </MockedAppContext.Provider>,
    );

    const titleComponent = wrapper.getByTestId('invitation_list.header');
    expect(titleComponent).toBeDefined();

    const textLinkToInvitationSettings = wrapper.getByTestId('invitation_list.text_link_to_invitation_settings');
    expect(textLinkToInvitationSettings).toBeDefined();
    fireEvent.press(textLinkToInvitationSettings);
    expect(navigate).toBeCalledWith(menuStack.invitationPrivacy);

    const listComponent = wrapper.getAllByTestId('invitation_block.list_invitation');
    expect(listComponent).toBeDefined();
    expect(listComponent.length).toBe(mockGroupedInvitations.length);

    const listComponentItems = wrapper.getAllByTestId('invitation_item.container');
    expect(listComponentItems.length).toBe(mockResposeListInvitation.data.length);
  });

  it('should render empty screen if user has no invitation', () => {
    useMyInvitationsStore.setState((state: IMyInvitationsStore) => {
      state.hasNextPage = false;
      state.groupedInvitations = [];
      state.invitationData = mockInvitationData as any;
      state.requestingsAccept = {};
      state.requestingsDecline = {};
      return state;
    });

    const values = { useMyInvitationsStore };

    const wrapper = render(
      <MockedAppContext.Provider value={values}>
        <InvitationList />
      </MockedAppContext.Provider>,
    );

    const emptyComponent = wrapper.queryByTestId('invitation_list.box_empty');
    expect(emptyComponent).toBeDefined();
  });
});
