import React from 'react';
import { act } from 'react-test-renderer';
import { fireEvent, render, renderWithRedux } from '~/test/testUtils';
import useGeneralInformationStore from '../store';
import CoverImage from './CoverImage';

describe('CoverImage component', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  const baseProps = {
    testID: 'CoverImage',
    backgroundUrl: '',
    canEditInfo: false,
    onEditCover: jest.fn(),
  };

  it('renders correctly', () => {
    const rendered = render(<CoverImage {...baseProps} />);
    const { getByTestId } = rendered;
    const containerComponent = getByTestId(baseProps.testID);
    expect(containerComponent).toBeDefined();
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

    const rendered = renderWithRedux(<CoverImage backgroundUrl="" canEditInfo onEditCover={onEditCover} />);

    const buttonComponent = rendered.getByTestId('info_card.button_edit');
    fireEvent.press(buttonComponent);
    expect(onEditCover).toBeCalled();
  });
});
