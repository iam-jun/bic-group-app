/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';

import { fireEvent, render } from '~/test/testUtils';
import InvitationItem from './InvitationItem';
import { mockGroupedInvitations, mockInvitationData, mockResposeListInvitation } from '~/test/mock_data/invitations';
import useMyInvitationsStore, { IMyInvitationsStore } from '../store';
import * as navigationHook from '~/hooks/navigation';
import { MockedAppContext } from '~/test/MockedAppContext';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import mainTabStack from '~/router/navigator/MainStack/stack';

describe('InvitationItem component', () => {
  it('should render correctly', () => {
    const invitationId = mockResposeListInvitation.data[0].id;
    const groupId = 1;
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const acceptInvitation = jest.fn();
    const declineInvitation = jest.fn();
    useMyInvitationsStore.setState((state: IMyInvitationsStore) => {
      state.hasNextPage = false;
      state.groupedInvitations = mockGroupedInvitations;
      state.invitationData = mockInvitationData as any;
      state.actions.acceptInvitation = acceptInvitation;
      state.actions.declineInvitation = declineInvitation;
      state.requestingsAccept = {};
      state.requestingsDecline = {};
      return state;
    });

    const values = { useMyInvitationsStore };

    const wrapper = render(
      <MockedAppContext.Provider value={values}>
        <InvitationItem
          id={invitationId}
          groupedId={groupId}
        />
      </MockedAppContext.Provider>,
    );

    const buttonDecline = wrapper.getByTestId('button_invitation.decline');
    expect(buttonDecline).toBeDefined();

    const buttonAccept = wrapper.getByTestId('button_invitation.accept');
    expect(buttonAccept).toBeDefined();

    fireEvent.press(buttonDecline);
    expect(declineInvitation).toBeCalled();

    fireEvent.press(buttonAccept);
    expect(acceptInvitation).toBeCalled();

    const avatarComponent = wrapper.getByTestId('invitation_item.actor');
    expect(avatarComponent).toBeDefined();

    const actorNameComponent = wrapper.getByTestId('invitation_item.actor_name');
    expect(actorNameComponent).toBeDefined();

    const targetNameComponent = wrapper.getByTestId('invitation_item.target_name');
    expect(targetNameComponent).toBeDefined();
    fireEvent.press(targetNameComponent);
    const expectedParams = {
      groupId: mockResposeListInvitation.data[0].targetInfo.id,
      communityId: mockResposeListInvitation.data[0].communityId,
    };
    expect(navigate).toBeCalledWith(groupStack.groupDetail, expectedParams);
  });

  it('should render correctly and navigate to community detail', () => {
    const invitationId = mockResposeListInvitation.data[1].id;
    const groupedId = 2;
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const acceptInvitation = jest.fn();
    const declineInvitation = jest.fn();
    useMyInvitationsStore.setState((state: IMyInvitationsStore) => {
      state.hasNextPage = false;
      state.groupedInvitations = mockGroupedInvitations;
      state.invitationData = mockInvitationData as any;
      state.actions.acceptInvitation = acceptInvitation;
      state.actions.declineInvitation = declineInvitation;
      state.requestingsAccept = {};
      state.requestingsDecline = {};
      return state;
    });

    const values = { useMyInvitationsStore };

    const wrapper = render(
      <MockedAppContext.Provider value={values}>
        <InvitationItem
          id={invitationId}
          groupedId={groupedId}
        />
      </MockedAppContext.Provider>,
    );

    const targetNameComponent = wrapper.getByTestId('invitation_item.target_name');
    expect(targetNameComponent).toBeDefined();
    fireEvent.press(targetNameComponent);
    expect(navigate).toBeCalledWith(mainTabStack.communityDetail, {
      communityId: mockResposeListInvitation.data[1].communityId,
    });
  });
});
