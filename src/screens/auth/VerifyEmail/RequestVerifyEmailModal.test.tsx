import React from 'react';

import {
  act,
  fireEvent,
  renderHook,
  renderWithRedux,
} from '~/test/testUtils';
import RequestVerifyEmailModal from './RequestVerifyEmailModal';
import useVerifyEmailController from './store';
import groupApi from '~/api/GroupApi';
import modalActions from '~/storeRedux/modal/actions';

describe('RequestVerifyEmailModal Component', () => {
  const email = 'test@evol.vn';

  it('renders correctly', () => {
    const rendered = renderWithRedux(
      <RequestVerifyEmailModal
        email={email}
      />,
    );
    expect(rendered).toMatchSnapshot();
  });

  it('should sent verify email success correctly', () => {
    const { result } = renderHook(() => useVerifyEmailController((state) => state));
    act(() => {
      result.current.actions.setSentVerifyEmail(true);
    });

    const rendered = renderWithRedux(
      <RequestVerifyEmailModal
        email={email}
      />,
    );

    expect(rendered).toMatchSnapshot();

    const button = rendered.queryByTestId('request_verify_email_modal.button');
    expect(button).toBeNull();
  });

  it('should call api sent verify email', () => {
    const response = {
      code: 200,
      data: {},
      meta: {},
    };
    const spy = jest.spyOn(groupApi, 'resendVerificationEmail').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const rendered = renderWithRedux(
      <RequestVerifyEmailModal
        email={email}
      />,
    );

    const button = rendered.queryByTestId('request_verify_email_modal.button');
    expect(button).toBeDefined();

    fireEvent.press(button);

    expect(spy).toBeCalled();
  });

  it('should close modal when click close button', () => {
    const spy = jest.spyOn(modalActions, 'hideModal');

    const rendered = renderWithRedux(
      <RequestVerifyEmailModal
        email={email}
      />,
    );

    const button = rendered.queryByTestId('request_verify_email_modal.button_close');
    expect(button).toBeDefined();

    fireEvent.press(button);

    expect(spy).toBeCalled();
  });
});
