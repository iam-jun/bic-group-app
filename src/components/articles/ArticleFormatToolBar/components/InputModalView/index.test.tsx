import React from 'react';
import { fireEvent, render } from '~/test/testUtils';
import InputModalView from '.';
import useModalStore from '~/store/modal';

describe('InputModalView component', () => {
  const props = {
    type: 'link' as const,
    insertLink: jest.fn(),
    insertEmbed: jest.fn(),
  };

  it('renders correctly type=link', () => {
    const hideModal = jest.fn();
    useModalStore.setState((state) => {
      state.actions.hideModal = hideModal;
      return state;
    });

    const rendered = render(<InputModalView {...props} />);

    const containerView = rendered.queryByTestId('input_modal_view');
    expect(containerView).toBeDefined();

    const btnCancel = rendered.queryByTestId('input_modal_view.btn_cancel');
    fireEvent.press(btnCancel);
    expect(hideModal).toBeCalled();

    const linkText = rendered.getByTestId('input_modal_view.link_text');
    fireEvent.changeText(linkText, 'test');
    const linkValue = rendered.getByTestId('input_modal_view.link_value');
    fireEvent.changeText(linkValue, 'test');
    const btnSave = rendered.getByTestId('input_modal_view.btn_save');
    fireEvent.press(btnSave);
    expect(props.insertLink).toBeCalled();
  });

  it('renders correctly type=embed', () => {
    const newProps = { ...props, type: 'embed' as const };
    const rendered = render(<InputModalView {...newProps} />);

    const containerView = rendered.queryByTestId('input_modal_view.embed_url');
    expect(containerView).toBeDefined();
  });
});
