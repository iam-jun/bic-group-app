import React from 'react';
import { postImage } from '~/test/mock_data/pinContent';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import HeaderPinContentItem from './index';
import useModalStore from '~/store/modal';

describe('HeaderPinContentItem component', () => {
  it('renders correctly', () => {
    const rendered = renderWithRedux(
      <HeaderPinContentItem
        data={postImage as any}
        isAdmin
        id="1"
      />,
    );
    const header = rendered.queryByTestId('header_pin_content_item');
    expect(header).toBeDefined();
  });

  it('should call onPress Header', () => {
    const showBottomList = jest.fn();
    useModalStore.setState((state) => {
      state.actions = { showBottomList } as any;
      return state;
    });

    const rendered = renderWithRedux(
      <HeaderPinContentItem
        data={postImage as any}
        isAdmin
        id="1"
      />,
    );
    const unpinButton = rendered.queryByTestId('header_pin_content_item.unpin_button');
    expect(unpinButton).toBeDefined();
    fireEvent.press(unpinButton);
    expect(showBottomList).toBeCalled();
  });
});
