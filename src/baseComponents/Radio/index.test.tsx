import React from 'react';

import Radio from '.';
import { fireEvent, renderWithRedux } from '../../test/testUtils';

describe('Radio component', () => {
  it('should render unselect state with default size medium', () => {
    const rendered = renderWithRedux(<Radio isChecked={false} label="Label" />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('should render selected state with default size medium', () => {
    const rendered = renderWithRedux(<Radio isChecked label="Label" />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('should render disabled state with default size medium', () => {
    const rendered = renderWithRedux(<Radio disabled="disabled" label="Label" isChecked />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('should render disabled state with size small', () => {
    const rendered = renderWithRedux(<Radio size="small" disabled="disabled" label="Label" isChecked />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('should render disabled-auto-selected state with default size medium', () => {
    const rendered = renderWithRedux(<Radio disabled="disabled-auto-selected" label="Label" isChecked />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('should call onPress when pressing on Radio', () => {
    const onPress = jest.fn();
    const wrapper = renderWithRedux(<Radio onPress={onPress} testID="radio" isChecked />);
    const button = wrapper.getByTestId('radio');
    fireEvent.press(button);
    expect(onPress).toBeCalled();
  });

  it('should NOT call onPress when pressing on disabled Radio', () => {
    const onPress = jest.fn();
    const wrapper = renderWithRedux(<Radio disabled="disabled" onPress={onPress} testID="radio" isChecked />);
    const button = wrapper.getByTestId('radio');
    fireEvent.press(button);
    expect(onPress).not.toBeCalled();
  });

  it('should NOT call onPress when pressing on disabled-auto-selected Radio', () => {
    const onPress = jest.fn();
    const wrapper = renderWithRedux(<Radio disabled="disabled-auto-selected" onPress={onPress} testID="radio" isChecked />);
    const button = wrapper.getByTestId('radio');
    fireEvent.press(button);
    expect(onPress).not.toBeCalled();
  });
});
