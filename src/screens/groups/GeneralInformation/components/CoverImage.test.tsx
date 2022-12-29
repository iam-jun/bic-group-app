import React from 'react';
import { StyleSheet } from 'react-native';
import { act } from 'react-test-renderer';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import colors from '~/theme/theme';
import useGeneralInformationStore from '../store';
import CoverImage from './CoverImage';

describe('CoverImage component', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  const baseProps = {
    backgroundUrl: '',
    canEditInfo: false,
    onEditCover: jest.fn(),
  };

  it('renders correctly', () => {
    const rendered = renderWithRedux(
      <CoverImage {...baseProps} />,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('should show loading', () => {
    jest.useFakeTimers();
    act(() => {
      useGeneralInformationStore.setState({
        loadingCover: true,
      });
    });
    act(() => {
      jest.runAllTimers();
    });

    const rendered = renderWithRedux(<CoverImage {...baseProps} />);

    const loadingComponent = rendered.getByTestId('cover.loading');
    expect(loadingComponent).not.toBeNull();
  });

  it('should show cover', () => {
    jest.useFakeTimers();
    act(() => {
      useGeneralInformationStore.setState({
        loadingCover: false,
      });
    });
    act(() => {
      jest.runAllTimers();
    });

    const rendered = renderWithRedux(<CoverImage {...baseProps} />);

    const imageComponent = rendered.getByTestId('cover.image');
    const loadingComponent = rendered.queryByTestId('cover.loading');
    expect(loadingComponent).toBeNull();
    expect(imageComponent).toBeDefined();
  });

  it('should disable button when loading', () => {
    jest.useFakeTimers();
    act(() => {
      useGeneralInformationStore.setState({
        loadingCover: true,
      });
    });
    act(() => {
      jest.runAllTimers();
    });

    const rendered = renderWithRedux(<CoverImage {...baseProps} canEditInfo />);

    const buttonComponent = rendered.getByTestId('cover.button_edit');
    const textComponent = rendered.getByTestId('cover.text_edit');
    const flattenedStyle = StyleSheet.flatten(textComponent.props.style);
    expect(flattenedStyle.color).toBe(colors.light.colors.gray40);
    expect(buttonComponent.props.accessibilityState.disabled).toBe(true);
  });

  it('should call onEditCover when edit button press', () => {
    jest.useFakeTimers();
    act(() => {
      useGeneralInformationStore.setState({
        loadingCover: false,
      });
    });
    act(() => {
      jest.runAllTimers();
    });

    const onEditCover = jest.fn();

    const rendered = renderWithRedux(
      <CoverImage backgroundUrl="" canEditInfo onEditCover={onEditCover} />,
    );

    const buttonComponent = rendered.getByTestId('cover.button_edit');
    fireEvent.press(buttonComponent);
    expect(onEditCover).toBeCalled();
  });
});
