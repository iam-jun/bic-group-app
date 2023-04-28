import React from 'react';
import useModalStore from '~/store/modal';

import { fireEvent, render } from '~/test/testUtils';
import useAuthController from '../../store';
import SignUpSuccessModal from './SignUpSuccessModal';

describe('SignUpSuccessModal component', () => {
  const baseProps = {
    email: 'test',
  };

  it('renders correctly', () => {
    const hideModal = jest.fn();
    useModalStore.setState((state) => {
      state.actions.hideModal = hideModal;
      return state;
    });

    const resendVerifyEmail = jest.fn();
    useAuthController.setState((state) => {
      state.actions.resendVerifyEmail = resendVerifyEmail;
      return state;
    });

    jest.useFakeTimers();
    const rendered = render(<SignUpSuccessModal {...baseProps} />);
    jest.runAllTimers();
    const { getByTestId } = rendered;
    const containerComponent = getByTestId('sign_up_success_modal');
    expect(containerComponent).toBeDefined();

    const closeBtn = getByTestId('sign_up_success_modal.button_close');
    fireEvent.press(closeBtn);
    expect(hideModal).toBeCalled();

    const resendBtn = getByTestId('sign_up_success_modal.button_resend');
    fireEvent.press(resendBtn);
    expect(resendVerifyEmail).toBeCalled();
  });
});
