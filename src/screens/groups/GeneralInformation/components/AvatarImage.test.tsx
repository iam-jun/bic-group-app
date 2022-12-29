import React from 'react';
import { StyleSheet } from 'react-native';
import { act } from 'react-test-renderer';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import colors from '~/theme/theme';
import useGeneralInformationStore from '../store';
import AvatarImage from './AvatarImage';

describe('AvatarImage component', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  const baseProps = {
    avatar: '',
    canEditInfo: false,
    onEditAvatar: jest.fn(),
  };

  it('renders correctly', () => {
    const rendered = renderWithRedux(
      <AvatarImage {...baseProps} />,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('should show loading', () => {
    jest.useFakeTimers();
    act(() => {
      useGeneralInformationStore.setState({
        loadingAvatar: true,
      });
    });
    act(() => {
      jest.runAllTimers();
    });

    const rendered = renderWithRedux(<AvatarImage {...baseProps} />);

    const loadingComponent = rendered.getByTestId('avatar.loading');
    expect(loadingComponent).not.toBeNull();
  });

  it('should show avatar', () => {
    jest.useFakeTimers();
    act(() => {
      useGeneralInformationStore.setState({
        loadingAvatar: false,
      });
    });
    act(() => {
      jest.runAllTimers();
    });

    const rendered = renderWithRedux(<AvatarImage {...baseProps} />);

    const imageComponent = rendered.getByTestId('avatar.image');
    const loadingComponent = rendered.queryByTestId('avatar.loading');
    expect(loadingComponent).toBeNull();
    expect(imageComponent).toBeDefined();
  });

  it('should disable button when loading', () => {
    jest.useFakeTimers();
    act(() => {
      useGeneralInformationStore.setState({
        loadingAvatar: true,
      });
    });
    act(() => {
      jest.runAllTimers();
    });

    const rendered = renderWithRedux(<AvatarImage {...baseProps} canEditInfo />);

    const buttonComponent = rendered.getByTestId('avatar.button_edit');
    const textComponent = rendered.getByTestId('avatar.text_edit');
    const flattenedStyle = StyleSheet.flatten(textComponent.props.style);
    expect(flattenedStyle.color).toBe(colors.light.colors.gray40);
    expect(buttonComponent.props.accessibilityState.disabled).toBe(true);
  });

  it('should call onEditAvatar when edit button press', () => {
    jest.useFakeTimers();
    act(() => {
      useGeneralInformationStore.setState({
        loadingAvatar: false,
      });
    });
    act(() => {
      jest.runAllTimers();
    });

    const onEditAvatar = jest.fn();

    const rendered = renderWithRedux(
      <AvatarImage avatar="" onEditAvatar={onEditAvatar} canEditInfo />,
    );

    const buttonComponent = rendered.getByTestId('avatar.button_edit');
    fireEvent.press(buttonComponent);
    expect(onEditAvatar).toBeCalled();
  });
});
