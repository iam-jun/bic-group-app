import React from 'react';
import { render } from '@testing-library/react-native';
import TextSelectedPeople from './TextSelectedPeople';

describe('TextSelectedPeople', () => {
  it('renders correctly with selected users', () => {
    const testProps = {
      selectedUsers: ['user-1', 'user-2'],
    };
    const { getByTestId } = render(<TextSelectedPeople {...testProps} />);
    expect(getByTestId('text_selected_people')).toBeDefined();
  });
});
