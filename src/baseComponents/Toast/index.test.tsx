import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Toast from './index';
import useModalStore from '~/store/modal';

// Mock the useSafeAreaInsets hook
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(() => ({
    bottom: 0,
  })),
}));

// Mock the useKeyboardStatus hook
jest.mock('~/hooks/keyboard', () => ({
  useKeyboardStatus: jest.fn(() => ({
    height: 0,
  })),
}));

describe('Toast', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const onButtonPress = jest.fn();
  const onClose = jest.fn();

  it('should render the toast message with countdown correctly', () => {
    useModalStore.setState((state) => {
      state.toast = {
        content: 'This is toast message',
        duration: 5000,
        buttonText: 'Dismiss',
        onButtonPress,
        onClose,
      };
      return state;
    });

    const { getByTestId } = render(<Toast />);
    expect(getByTestId('base_toast.button_text').props.children).toEqual('Dismiss (5s)');
    expect(getByTestId('base_toast.content').props.children).toEqual('This is toast message');
  });

  it('should hide the toast when closed', () => {
    useModalStore.setState((state) => {
      state.toast = {
        content: 'This is toast message',
        duration: 5000,
        buttonText: 'Dismiss',
        onButtonPress,
        onClose,
      };
      return state;
    });

    const { getByTestId } = render(<Toast />);
    const closeButton = getByTestId('base_toast.close');
    fireEvent.press(closeButton);
    expect(onClose).toHaveBeenCalled();
  });

  it('should call the onButtonPress callback when button is pressed', () => {
    useModalStore.setState((state) => {
      state.toast = {
        content: 'This is toast message',
        duration: 5000,
        buttonText: 'Dismiss',
        onButtonPress,
        onClose,
      };
      return state;
    });

    const { getByTestId } = render(<Toast />);
    const button = getByTestId('base_toast.button_text');
    fireEvent.press(button);
    expect(onButtonPress).toHaveBeenCalled();
  });
});
