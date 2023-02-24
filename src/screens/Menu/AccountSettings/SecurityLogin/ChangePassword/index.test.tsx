import React from 'react';
import { act } from 'react-test-renderer';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import ChangePassword from './index';
import useChangePasswordStore from './store';

jest.mock('react-hook-form', () => ({
  ...(jest.requireActual('react-hook-form') as object),
}));

describe('ChangePassword component', () => {
  it('renders correctly', async () => {
    const changePassword = jest.fn();
    useChangePasswordStore.setState((state) => {
      state.errorText = 'error';
      state.actions.changePassword = changePassword;
      return state;
    });

    const rendered = renderWithRedux(<ChangePassword />);
    const { getByTestId } = rendered;
    const component = getByTestId('change_password');
    expect(component).toBeDefined();

    const currentPasswordInput = getByTestId('change_password.current_password');
    const newPasswordInput = getByTestId('change_password.new_password');
    const confirmPasswordInput = getByTestId('change_password.confirm_password');
    await act(async () => {
      fireEvent.changeText(currentPasswordInput, '12345678');
      fireEvent.changeText(newPasswordInput, '12345678.A');
      fireEvent.changeText(confirmPasswordInput, '12345678.A');
    });

    const btn = getByTestId('change_password.save');
    fireEvent.press(btn);
    expect(changePassword).toBeCalled();
  });
});
