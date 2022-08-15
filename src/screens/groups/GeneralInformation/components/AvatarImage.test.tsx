import React from 'react';
import { StyleSheet } from 'react-native';
import initialState from '~/storeRedux/initialState';
import { fireEvent, renderWithRedux, configureStore } from '~/test/testUtils';
import colors from '~/theme/theme';
import AvatarImage from './AvatarImage';

describe('AvatarImage component', () => {
  const baseProps = {
    avatar: '',
    canEditInfo: false,
    onEditAvatar: jest.fn(),
  };

  const mockStore = configureStore([]);

  const storeData = { ...initialState };

  it('renders correctly', () => {
    const store = mockStore(storeData);
    const rendered = renderWithRedux(
      <AvatarImage {...baseProps} />,
      store,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('should show loading', () => {
    storeData.groups.loadingAvatar = true;
    const store = mockStore(storeData);

    const rendered = renderWithRedux(<AvatarImage {...baseProps} />, store);

    const loadingComponent = rendered.getByTestId('avatar.loading');
    expect(loadingComponent).not.toBeNull();
  });

  it('should show avatar', () => {
    storeData.groups.loadingAvatar = false;
    const store = mockStore(storeData);

    const rendered = renderWithRedux(<AvatarImage {...baseProps} />, store);

    const imageComponent = rendered.getByTestId('avatar.image');
    const loadingComponent = rendered.queryByTestId('avatar.loading');
    expect(loadingComponent).toBeNull();
    expect(imageComponent).toBeDefined();
  });

  it('should disable button when loading', () => {
    storeData.groups.loadingAvatar = true;
    const store = mockStore(storeData);

    const rendered = renderWithRedux(<AvatarImage {...baseProps} canEditInfo />, store);

    const buttonComponent = rendered.getByTestId('avatar.button_edit');
    const textComponent = rendered.getByTestId('avatar.text_edit');
    const flattenedStyle = StyleSheet.flatten(textComponent.props.style);
    expect(flattenedStyle.color).toBe(colors.light.colors.gray40);
    expect(buttonComponent.props.accessibilityState.disabled).toBe(true);
  });

  it('should call onEditAvatar when edit button press', () => {
    storeData.groups.loadingAvatar = false;
    const store = mockStore(storeData);

    const onEditAvatar = jest.fn();

    const rendered = renderWithRedux(
      <AvatarImage avatar="" onEditAvatar={onEditAvatar} canEditInfo />,
      store,
    );

    const buttonComponent = rendered.getByTestId('avatar.button_edit');
    fireEvent.press(buttonComponent);
    expect(onEditAvatar).toBeCalled();
  });
});
