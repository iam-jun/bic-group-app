import React from 'react';
import useModalStore from '~/store/modal';

import { fireEvent, renderWithRedux } from '~/test/testUtils';
import UserHeader from './index';

describe('UserHeader component', () => {
  it('renders correctly', () => {
    const fullname = 'test';
    const username = 'test';
    const latestWork = { company: 'Test', titlePosition: 'Test' };

    const rendered = renderWithRedux(
      <UserHeader id="123" fullname={fullname} username={username} latestWork={latestWork} isCurrentUser />,
    );
    const { getByTestId } = rendered;
    const containerComponent = getByTestId('user_profile');
    expect(containerComponent).toBeDefined();
  });

  it('renders isCurrentUser=false correctly', () => {
    const showModal = jest.fn();
    const hideModal = jest.fn();
    useModalStore.setState((state) => {
      state.actions.showModal = showModal;
      state.actions.hideModal = hideModal;
      return state;
    });

    const fullname = 'test';
    const username = 'test';
    const latestWork = { company: 'Test', titlePosition: 'Test' };

    const rendered = renderWithRedux(
      <UserHeader id="123" fullname={fullname} username={username} latestWork={latestWork} isCurrentUser={false} />,
    );
    const { getByTestId } = rendered;
    const btnBlock = getByTestId('user_header.btn_block');
    fireEvent.press(btnBlock);
    expect(showModal).toBeCalled();
  });
});
