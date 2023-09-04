/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';

import { fireEvent, renderWithRedux } from '~/test/testUtils';
import NotificationInvitationButtons from './index';

describe('InvitationButtons component', () => {
  it('should render correctly', () => {
    const onAccept = jest.fn();
    const onDecline = jest.fn();

    const requestingsAccept = false;
    const requestingsDecline = false;

    const wrapper = renderWithRedux(
      <NotificationInvitationButtons
        isLoadingAccept={requestingsAccept}
        isLoadingDecline={requestingsDecline}
        onAccept={onAccept}
        onDecline={onDecline}
      />,
    );

    const buttonDecline = wrapper.queryByTestId('button_invitation.decline');
    expect(buttonDecline).toBeDefined();

    const buttonAccept = wrapper.queryByTestId('button_invitation.accept');
    expect(buttonAccept).toBeDefined();

    fireEvent.press(buttonDecline);
    expect(onDecline).toHaveBeenCalledTimes(1);

    fireEvent.press(buttonAccept);
    expect(onAccept).toHaveBeenCalledTimes(1);
  });

  it('should render correctly when isLoadingAccept = true', () => {
    const onAccept = jest.fn();
    const onDecline = jest.fn();

    const requestingsAccept = true;
    const requestingsDecline = false;

    const wrapper = renderWithRedux(
      <NotificationInvitationButtons
        isLoadingAccept={requestingsAccept}
        isLoadingDecline={requestingsDecline}
        onAccept={onAccept}
        onDecline={onDecline}
      />,
    );

    const buttonDecline = wrapper.queryByTestId('button_invitation.decline');
    expect(buttonDecline).toBeDefined();
    expect(buttonDecline.props?.accessibilityState?.disabled).toBeTruthy();

    const buttonAccept = wrapper.queryByTestId('button_invitation.accept');
    expect(buttonAccept).toBeDefined();
    expect(buttonAccept.props?.accessibilityState?.disabled).toBeTruthy();
  });

  it('should render correctly when isLoadingDecline = true', () => {
    const onAccept = jest.fn();
    const onDecline = jest.fn();

    const requestingsAccept = false;
    const requestingsDecline = true;

    const wrapper = renderWithRedux(
      <NotificationInvitationButtons
        isLoadingAccept={requestingsAccept}
        isLoadingDecline={requestingsDecline}
        onAccept={onAccept}
        onDecline={onDecline}
      />,
    );

    const buttonDecline = wrapper.queryByTestId('button_invitation.decline');
    expect(buttonDecline).toBeDefined();
    expect(buttonDecline.props?.accessibilityState?.disabled).toBeTruthy();

    const buttonAccept = wrapper.queryByTestId('button_invitation.accept');
    expect(buttonAccept).toBeDefined();
    expect(buttonAccept.props?.accessibilityState?.disabled).toBeTruthy();
  });
});
