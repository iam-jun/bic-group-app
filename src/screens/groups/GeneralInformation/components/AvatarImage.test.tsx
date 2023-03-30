import React from 'react';
import { act } from 'react-test-renderer';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
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

    const buttonComponent = rendered.getByTestId('info_card.button_edit');
    fireEvent.press(buttonComponent);
    expect(onEditAvatar).toBeCalled();
  });
});
