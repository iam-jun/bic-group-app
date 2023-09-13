import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SelectedPeople from './SelectedPeople';
import { user1, user2 } from '~/test/mock_data/joinableUsers';

describe('SelectedPeople', () => {
  it('renders correctly with selected users', () => {
    const testProps = {
      data: {
        'user-1': user1,
        'user-2': user2,
      },
      selectedUsers: ['user-1', 'user-2'],
      onSelectUser: jest.fn(),
    };
    const { getByTestId, getByText } = render(<SelectedPeople {...testProps} />);
    expect(getByTestId('chosen_people')).toBeDefined();
    expect(getByText('User 1')).toBeDefined();
    expect(getByText('User 2')).toBeDefined();
  });

  it('calls onSelectUser when close icon X is pressed', () => {
    const testProps = {
      data: {
        'user-1': user1,
      },
      selectedUsers: ['user-1'],
      onSelectUser: jest.fn(),
    };
    const { getByTestId } = render(<SelectedPeople {...testProps} />);
    fireEvent.press(getByTestId('avatar.action_icon.button'));
    expect(testProps.onSelectUser).toHaveBeenCalledWith('user-1');
  });

  it('renders nothing with no selected users', () => {
    const { queryByTestId } = render(<SelectedPeople data={{}} selectedUsers={[]} onSelectUser={jest.fn()} />);
    expect(queryByTestId('chosen_people')).toBeNull();
  });
});
