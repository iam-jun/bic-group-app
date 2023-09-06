import React from 'react';
import { render } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import CommunityInvitedPeople, { CommunityInvitedPeopleProps } from './index';
import { ITypeGroup } from '~/interfaces/common';
import useGroupJoinableUsersStore from '~/components/InvitePeopleToYourGroup/store';
import { responseGetInvitations } from '~/test/mock_data/invitedPeople';

describe('CommunityInvitedPeople', () => {
  it('renders correctly', async () => {
    const props: CommunityInvitedPeopleProps = {
      groupId: 'test',
      type: ITypeGroup.GROUP,
    };
    const getInvitations = jest.fn();
    useGroupJoinableUsersStore.setState((state) => {
      state.invitedPeople.data = responseGetInvitations.data;
      state.invitedPeople.canLoadMore = false;
      state.actions.getInvitations = getInvitations;
      return state;
    });

    const { getByTestId } = render(<CommunityInvitedPeople {...props} />);
    const flatlist = getByTestId('flatlist');
    expect(flatlist).toBeDefined();
    expect(getByTestId('flatlist.text_you_have_seen_it_all')).toBeDefined();

    const { refreshControl } = flatlist.props;
    await act(async () => {
      refreshControl.props.onRefresh();
    });
    expect(getInvitations).toBeCalled();
  });

  it('renders correctly no data', async () => {
    const props: CommunityInvitedPeopleProps = {
      groupId: 'test',
      type: ITypeGroup.GROUP,
    };
    useGroupJoinableUsersStore.setState((state) => {
      state.invitedPeople.canLoadMore = false;
      return state;
    });

    const { getByTestId } = render(<CommunityInvitedPeople {...props} />);
    const EmptyView = getByTestId('no_one_is_invited');
    expect(EmptyView).toBeDefined();
  });
});
