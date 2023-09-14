import React from 'react';

import {
  cleanup, fireEvent, render, waitFor,
} from '~/test/testUtils';
import usePreviewJoinableGroupStore from './store';
import InvitePeopleToYourGroup from './index';
import { ITypeGroup } from '~/interfaces/common';

afterEach(cleanup);

describe('PreviewJoinableGroup component', () => {
  const baseProps = {
    groupId: 'test',
    type: ITypeGroup.COMMUNITY,
  };

  it('renders correctly', async () => {
    const invitations = jest.fn();
    const getGroupJoinableUsers = jest.fn();
    usePreviewJoinableGroupStore.setState((state) => {
      state.actions.invitations = invitations;
      state.actions.getGroupJoinableUsers = getGroupJoinableUsers;
      state.selectedUsers = ['0'];
      state.data = {
        0: {
          avatar: 'test',
          fullname: 'test',
          id: 'test',
          username: 'test',
        },
      };
      return state;
    });

    const rendered = render(<InvitePeopleToYourGroup {...baseProps} />);
    const { getByTestId } = rendered;
    const containerComponent = getByTestId('invite_people_to_your_group');
    expect(containerComponent).toBeDefined();

    const input = rendered.getByTestId('search_input.input');
    expect(input).toBeDefined();
    fireEvent(input, 'onChangeText', 'test');

    await waitFor(() => {
      expect(getGroupJoinableUsers).toBeCalled();
    });

    const btnInvite = getByTestId('invite_people_to_your_group.btn_invite');
    fireEvent.press(btnInvite);
    expect(invitations).toBeCalled();
  });
});
