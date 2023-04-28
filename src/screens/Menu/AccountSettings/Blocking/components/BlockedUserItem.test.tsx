import React from 'react';
import { IBlockingUser } from '~/interfaces/IBlocking';
import useModalStore from '~/store/modal';

import { fireEvent, renderWithRedux } from '~/test/testUtils';
import BlockedUserItem from './BlockedUserItem';

describe('BlockedUserItem component', () => {
  const props = {
    item: {
      id: 'test',
    } as IBlockingUser,
  };
  it('renders correctly', () => {
    const showAlert = jest.fn();
    useModalStore.setState((state) => {
      state.actions.showAlert = showAlert;
      return state;
    });

    const rendered = renderWithRedux(<BlockedUserItem {...props} />);
    const { getByTestId } = rendered;
    const containerComponent = getByTestId(`blocked_user_item_${props.item.id}`);
    expect(containerComponent).toBeDefined();

    const btnUnblock = getByTestId(`blocked_user_item_${props.item.id}.btn_unblock`);
    fireEvent.press(btnUnblock);
    expect(showAlert).toBeCalled();
  });
});
