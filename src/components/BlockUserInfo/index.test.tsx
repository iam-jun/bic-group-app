import React from 'react';

import { fireEvent, renderWithRedux } from '~/test/testUtils';
import BlockUserInfo from '.';

describe('BlockUserInfo component', () => {
  const baseProps = {
    fullname: 'test',
    onConfirmBlock: jest.fn(),
    onCancelBlock: jest.fn(),
  };

  it('renders correctly', () => {
    const rendered = renderWithRedux(<BlockUserInfo {...baseProps} />);
    const { getByTestId } = rendered;
    const containerComponent = getByTestId('block_user_info');
    expect(containerComponent).toBeDefined();

    const btnCancel = getByTestId('block_user_info.btn_cancel');
    fireEvent.press(btnCancel);
    expect(baseProps.onCancelBlock).toBeCalled();
  });
});
