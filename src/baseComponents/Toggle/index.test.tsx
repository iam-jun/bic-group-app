import React from 'react';

import Toggle from '.';
import { fireEvent, renderWithRedux } from '../../test/testUtils';

describe('Toggle component', () => {
  it('should render active state with default size small', () => {
    const rendered = renderWithRedux(<Toggle isChecked />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('should render inactive state with default size small', () => {
    const rendered = renderWithRedux(<Toggle isChecked={false} />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('should render disabled state with default size small', () => {
    const rendered = renderWithRedux(<Toggle disabled />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('should render active state with size medium', () => {
    const rendered = renderWithRedux(<Toggle size="medium" isChecked />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('should render inactive state with size medium', () => {
    const rendered = renderWithRedux(<Toggle size="medium" isChecked={false} />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('should render disabled state with size medium', () => {
    const rendered = renderWithRedux(<Toggle size="medium" disabled />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('should call onPress when pressing on Toggle', () => {
    const onPress = jest.fn();
    const wrapper = renderWithRedux(<Toggle onValueChanged={onPress} testID="toggle" />);
    const button = wrapper.getByTestId('toggle');
    fireEvent.press(button);
    expect(onPress).toBeCalled();
  });

  it('should NOT call onPress when pressing on disabled Toggle', () => {
    const onPress = jest.fn();
    const wrapper = renderWithRedux(<Toggle onValueChanged={onPress} disabled testID="toggle" />);
    const button = wrapper.getByTestId('toggle');
    fireEvent.press(button);
    expect(onPress).not.toBeCalled();
  });

  it('should render circle spinner when loading = true', () => {
    const rendered = renderWithRedux(<Toggle loading />);
    const spinnerComponent = rendered.getByTestId('circle_spinner');
    expect(spinnerComponent).toBeDefined();
  });

  it('should NOT call onPress when pressing on loading Toggle', () => {
    const onPress = jest.fn();
    const wrapper = renderWithRedux(<Toggle onValueChanged={onPress} loading testID="toggle" />);
    const spinnerComponent = wrapper.getByTestId('circle_spinner');
    expect(spinnerComponent).toBeDefined();

    const button = wrapper.getByTestId('toggle');
    fireEvent.press(button);
    expect(onPress).not.toBeCalled();
  });
});
