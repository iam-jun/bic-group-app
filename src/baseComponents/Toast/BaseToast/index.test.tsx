import * as React from 'react';
import { fireEvent, render } from '~/test/testUtils';
import BaseToast, { ToastType } from '.';

describe('BaseToast component', () => {
  const onButtonPress = jest.fn();
  const onClose = jest.fn();
  const props = {
    content: 'This is toast message',
    buttonText: 'Dismiss',
    onButtonPress,
    onClose,
  };

  it('renders toast correctly', () => {
    const { getByTestId } = render(<BaseToast {...props} />);
    expect(getByTestId('base_toast.button_text').props.children).toEqual('Dismiss');
    expect(getByTestId('base_toast.content').props.children).toEqual('This is toast message');
  });

  it('should call prop onButtonPress', () => {
    const { getByTestId } = render(<BaseToast {...props} type={ToastType.ERROR} />);

    const button = getByTestId('base_toast.button_text');
    fireEvent.press(button);
    expect(onButtonPress).toHaveBeenCalled();
  });

  it('should call prop onPressClose', () => {
    const { getByTestId } = render(<BaseToast {...props} />);

    const closeButton = getByTestId('base_toast.close');
    fireEvent.press(closeButton);
    expect(onClose).toHaveBeenCalled();
  });
});
