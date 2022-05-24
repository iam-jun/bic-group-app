import React from 'react';

import {renderWithRedux, fireEvent} from '~/test/testUtils';
import SearchBaseModal from './SearchBaseModal';

describe('SearchBaseModal component', () => {
  const isOpen = true;
  const onClose = jest.fn();
  const onChangeText = jest.fn();

  it('should render icon back correctly', () => {
    const wrapper = renderWithRedux(<SearchBaseModal isOpen={isOpen} />);
    const backBtn = wrapper.getByTestId('search_modal.back_button');
    expect(backBtn).toBeDefined();
  });

  it('should run press back fn correctly', () => {
    const wrapper = renderWithRedux(
      <SearchBaseModal
        isOpen={isOpen}
        onClose={onClose}
        onChangeText={onChangeText}
      />,
    );
    const backBtn = wrapper.getByTestId('search_modal.back_button');
    fireEvent.press(backBtn);
    expect(onClose).toBeCalled();
    expect(onChangeText).toBeCalled();
  });

  it('should render search text input correctly', () => {
    const wrapper = renderWithRedux(<SearchBaseModal isOpen={isOpen} />);
    const textInput = wrapper.getByTestId('search_modal.text_input');
    expect(textInput).toBeDefined();
  });

  it('should render icon reset correctly when there is text input', () => {
    const wrapper = renderWithRedux(
      <SearchBaseModal
        initSearch="test"
        isOpen={isOpen}
        onClose={onClose}
        onChangeText={onChangeText}
      />,
    );
    const iconReset = wrapper.getByTestId('search_modal.reset_button');
    expect(iconReset).toBeDefined();
  });

  it('should clear text input correctly when press icon reset', () => {
    const wrapper = renderWithRedux(
      <SearchBaseModal
        initSearch="test"
        isOpen={isOpen}
        onClose={onClose}
        onChangeText={onChangeText}
      />,
    );
    const iconReset = wrapper.getByTestId('search_modal.reset_button');
    fireEvent.press(iconReset);
    expect(onChangeText).toBeCalled();
  });

  it('should NOT render icon reset correctly when there is NO text input', () => {
    const wrapper = renderWithRedux(
      <SearchBaseModal
        isOpen={isOpen}
        onClose={onClose}
        onChangeText={onChangeText}
      />,
    );
    const iconReset = wrapper.queryByTestId('search_modal.reset_button');
    expect(iconReset).toBeNull();
  });
});
