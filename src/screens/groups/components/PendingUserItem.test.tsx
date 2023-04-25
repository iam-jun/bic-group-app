import React from 'react';

import PendingUserItem from './PendingUserItem';
import { renderWithRedux, fireEvent } from '~/test/testUtils';
import { memberRequestDetail, mockAnswers } from '~/test/mock_data/communities';

describe('PendingUserItem component', () => {
  const requestItem = { ...memberRequestDetail };
  const onPressApprove = jest.fn();
  const onPressDecline = jest.fn();

  it('should render data correctly', () => {
    const wrapper = renderWithRedux(
      <PendingUserItem
        requestItem={requestItem}
        onPressApprove={onPressApprove}
        onPressDecline={onPressDecline}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should call prop onPressDecline correctly', () => {
    const newRequestItem = { ...memberRequestDetail, memberRequestDetail: mockAnswers };
    const wrapper = renderWithRedux(
      <PendingUserItem
        requestItem={newRequestItem}
        onPressApprove={onPressApprove}
        onPressDecline={onPressDecline}
      />,
    );
    const declineBtn = wrapper.getByTestId('pending_user_item.btn_decline');
    fireEvent.press(declineBtn);
    expect(onPressDecline).toBeCalled();
  });

  it('should call prop onPressApprove correctly', () => {
    const wrapper = renderWithRedux(
      <PendingUserItem
        requestItem={requestItem}
        onPressApprove={onPressApprove}
        onPressDecline={onPressDecline}
      />,
    );
    const approveBtn = wrapper.getByTestId('pending_user_item.btn_approve');
    fireEvent.press(approveBtn);
    expect(onPressApprove).toBeCalled();
  });
});
