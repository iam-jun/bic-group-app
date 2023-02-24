import React from 'react';
import { render } from '~/test/testUtils';
import AddMembersToGroup from './index';
import useGroupJoinableUsersStore from './store';
import { user1 } from '~/test/mock_data/joinableUsers';

describe('AddMembersToGroup', () => {
  const route = { params: { groupId: 'test-group-id' } };

  it('renders correctly when no search text is typed', () => {
    useGroupJoinableUsersStore.setState((state) => {
      state.users = {
        ids: [],
        loading: false,
        hasNextPage: false,
      };
      state.selectedUsers = [];
      return state;
    });

    const { getByTestId, queryByTestId } = render(
      <AddMembersToGroup route={route} />,
    );
    const addButton = getByTestId('header.button');
    expect(addButton.props.accessibilityState.disabled).toBe(true);
    expect(getByTestId('search_input')).toBeDefined();
    expect(queryByTestId('chosen_people')).toBeNull();
  });

  it('enables the add button when there are selected users', () => {
    useGroupJoinableUsersStore.setState((state) => {
      state.data = {
        'user-1': user1,
      };
      state.users = {
        ids: [],
        loading: false,
        hasNextPage: false,
      };
      state.selectedUsers = ['user-1'];
      return state;
    });

    const { getByTestId } = render(
      <AddMembersToGroup route={route} />,
    );
    const addButton = getByTestId('header.button');
    expect(addButton.props.accessibilityState.disabled).toBe(false);
  });
});
