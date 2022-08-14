import React from 'react';

import Toggle from '.'
import { fireEvent, renderWithRedux } from '../../test/testUtils'

describe('Toggle component', () => {
  it('should render active state with default size small', () => {
    const rendered = renderWithRedux(<Toggle isChecked />).toJSON();
    expect(rendered).toMatchSnapshot();
  })

  it('should render inactive state with default size small', () => {
    const rendered = renderWithRedux(<Toggle isChecked={false} />).toJSON();
    expect(rendered).toMatchSnapshot();
  })

  it('should render disabled state with default size small', () => {
    const rendered = renderWithRedux(<Toggle disabled />).toJSON();
    expect(rendered).toMatchSnapshot();
  })

  it('should render active state with size medium', () => {
    const rendered = renderWithRedux(<Toggle size="medium" isChecked />).toJSON();
    expect(rendered).toMatchSnapshot();
  })

  it('should render inactive state with size medium', () => {
    const rendered = renderWithRedux(<Toggle size="medium" isChecked={false} />).toJSON();
    expect(rendered).toMatchSnapshot();
  })

  it('should render disabled state with size medium', () => {
    const rendered = renderWithRedux(<Toggle size="medium" disabled />).toJSON();
    expect(rendered).toMatchSnapshot();
  })

  it('should call onPress when pressing on Toggle', () => {
    const onPress = jest.fn();
    const wrapper = renderWithRedux(<Toggle onPress={onPress} testID="toggle" />);
    const button = wrapper.getByTestId('toggle');
    fireEvent.press(button);
    expect(onPress).toBeCalled();
  })

  it('should NOT call onPress when pressing on disabled Toggle', () => {
    const onPress = jest.fn();
    const wrapper = renderWithRedux(<Toggle onPress={onPress} disabled testID="toggle" />);
    const button = wrapper.getByTestId('toggle');
    fireEvent.press(button);
    expect(onPress).not.toBeCalled()
  })
})
