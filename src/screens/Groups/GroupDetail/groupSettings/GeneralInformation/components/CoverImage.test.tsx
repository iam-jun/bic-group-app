import React from 'react';
import {StyleSheet} from 'react-native';
import initialState from '~/store/initialState';
import {fireEvent, renderWithRedux, configureStore} from '~/test/testUtils';
import {colors} from '~/theme';
import CoverImage from './CoverImage';

describe('CoverImage component', () => {
  const baseProps = {
    onEditCover: jest.fn(),
  };

  const mockStore = configureStore([]);

  const storeData = {...initialState};

  it('renders correctly', () => {
    const store = mockStore(storeData);
    const rendered = renderWithRedux(
      <CoverImage {...baseProps} />,
      store,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it(`should show loading`, () => {
    storeData.groups.loadingCover = true;
    const store = mockStore(storeData);

    const rendered = renderWithRedux(<CoverImage {...baseProps} />, store);

    const loadingComponent = rendered.getByTestId('cover.loading');
    expect(loadingComponent).not.toBeNull();
  });

  it(`should show cover`, () => {
    storeData.groups.loadingCover = false;
    const store = mockStore(storeData);

    const rendered = renderWithRedux(<CoverImage {...baseProps} />, store);

    const imageComponent = rendered.getByTestId('cover.image');
    const loadingComponent = rendered.findByTestId('cover.loading');
    expect(loadingComponent).not.toBe({});
    expect(imageComponent).toBeDefined();
  });

  it(`should disable button when loading`, () => {
    storeData.groups.loadingCover = true;
    const store = mockStore(storeData);

    const rendered = renderWithRedux(<CoverImage {...baseProps} />, store);

    const buttonComponent = rendered.getByTestId('cover.button_edit');
    const textComponent = rendered.getByTestId('cover.text_edit');
    const flattenedStyle = StyleSheet.flatten(textComponent.props.style);
    expect(flattenedStyle.color).toBe(colors.light.colors.textDisabled);
    expect(buttonComponent.props.accessibilityState.disabled).toBe(true);
  });

  it(`should call onEditCover when edit button press`, () => {
    storeData.groups.loadingCover = false;
    const store = mockStore(storeData);

    const onEditCover = jest.fn();

    const rendered = renderWithRedux(
      <CoverImage onEditCover={onEditCover} />,
      store,
    );

    const buttonComponent = rendered.getByTestId('cover.button_edit');
    fireEvent.press(buttonComponent);
    expect(onEditCover).toBeCalled();
  });
});
