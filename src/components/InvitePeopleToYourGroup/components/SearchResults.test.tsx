import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SearchResults from './SearchResults';
import { user1, user2 } from '~/test/mock_data/joinableUsers';
import useGroupJoinableUsersStore from '../store';

describe('SearchResults', () => {
  const data = {
    'user-1': user1,
    'user-2': user2,
  };
  const onLoadMore = jest.fn();
  const onSelectUser = jest.fn();
  const selectedUsers = [];

  it('renders a list of users and select a user', () => {
    useGroupJoinableUsersStore.setState((state) => {
      state.users = {
        ids: ['user-1'],
        loading: false,
        hasNextPage: false,
      };
      return state;
    });

    const { queryByText, getByTestId } = render(
      <SearchResults data={data} selectedUsers={selectedUsers} onLoadMore={onLoadMore} onSelectUser={onSelectUser} />,
    );
    expect(queryByText('User 1')).not.toBeNull();
    const checkboxBtn = getByTestId('search_results.checkbox');
    expect(checkboxBtn).toBeDefined();
    fireEvent.press(checkboxBtn);
    expect(onSelectUser).toHaveBeenCalledWith('user-1');
  });

  it('renders NoSearchResultsFound when there is no data', () => {
    useGroupJoinableUsersStore.setState((state) => {
      state.users = {
        ids: [],
        loading: false,
        hasNextPage: false,
      };
      return state;
    });

    const { getByTestId } = render(
      <SearchResults data={data} selectedUsers={selectedUsers} onLoadMore={onLoadMore} onSelectUser={onSelectUser} />,
    );
    expect(getByTestId('no_search_results')).toBeDefined();
  });

  it('renders loading more at the bottom of the scrren when hasNextPage = true', () => {
    useGroupJoinableUsersStore.setState((state) => {
      state.users = {
        ids: [],
        loading: false,
        hasNextPage: true,
      };
      return state;
    });

    const { queryByTestId } = render(
      <SearchResults data={data} selectedUsers={selectedUsers} onLoadMore={onLoadMore} onSelectUser={onSelectUser} />,
    );
    expect(queryByTestId('search_results.loading')).toBeNull();
  });
});
