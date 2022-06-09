import React from 'react';

import {renderWithRedux, fireEvent} from '~/test/testUtils';
import ButtonApproveDeclineAllRequests from './ButtonApproveDeclineAllRequests';

describe('Button Approve Decline all requests', () => {
  const onPressDeclineAll = jest.fn();
  const onPressApproveAll = jest.fn();

  it('should render UI correctly', () => {
    const wrapper = renderWithRedux(
      <ButtonApproveDeclineAllRequests
        onPressDeclineAll={onPressDeclineAll}
        onPressApproveAll={onPressApproveAll}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should call prop onPressDeclineAll correctly', () => {
    const wrapper = renderWithRedux(
      <ButtonApproveDeclineAllRequests
        onPressDeclineAll={onPressDeclineAll}
        onPressApproveAll={onPressApproveAll}
      />,
    );
    const btnDeclineAll = wrapper.getByTestId(
      'button_approve_decline_all_requests.decline',
    );
    fireEvent.press(btnDeclineAll);
    expect(onPressDeclineAll).toBeCalled();
  });

  it('should call prop onPressApproveAll correctly', () => {
    const wrapper = renderWithRedux(
      <ButtonApproveDeclineAllRequests
        onPressDeclineAll={onPressDeclineAll}
        onPressApproveAll={onPressApproveAll}
      />,
    );
    const btnApproveAll = wrapper.getByTestId(
      'button_approve_decline_all_requests.approve',
    );
    fireEvent.press(btnApproveAll);
    expect(onPressApproveAll).toBeCalled();
  });
});
