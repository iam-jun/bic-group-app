import React from 'react';

import Checkbox from '.'
import { fireEvent, renderWithRedux } from '../../test/testUtils';

describe('Checkbox component', () => {
  it('should render unselect state with default size medium correctly', () => {
    const rendered = renderWithRedux(<Checkbox isChecked={false} label="Label" testID="checkbox" />).toJSON()
    expect(rendered).toMatchSnapshot();
  })

  it('should render selected state with default size medium correctly', () => {
    const rendered = renderWithRedux(<Checkbox isChecked label="Label" testID="checkbox" />).toJSON()
    expect(rendered).toMatchSnapshot();
  })

  it('should render indeterminate state with default size medium correctly', () => {
    const rendered = renderWithRedux(<Checkbox indeterminate label="Label" testID="checkbox" />).toJSON()
    expect(rendered).toMatchSnapshot();
  })

  it('should render disabled state with default size medium correctly', () => {
    const rendered = renderWithRedux(<Checkbox disabled="disabled" label="Label" testID="checkbox" />).toJSON()
    expect(rendered).toMatchSnapshot();
  })

  it('should render disabled state with size small correctly', () => {
    const rendered = renderWithRedux(<Checkbox size="small" disabled="disabled" label="Label" testID="checkbox" />).toJSON()
    expect(rendered).toMatchSnapshot();
  })

  it('should render disabled-auto-selected state with default size medium correctly', () => {
    const rendered = renderWithRedux(<Checkbox disabled="disabled-auto-selected" label="Label" testID="checkbox" />).toJSON()
    expect(rendered).toMatchSnapshot();
  })

  it('should call onPress when pressing on Checkbox', () => {
    const onPress = jest.fn();
    const wrapper = renderWithRedux(<Checkbox isChecked label="Label" onPress={onPress} testID="checkbox" />);
    const button = wrapper.getByTestId('checkbox');
    fireEvent.press(button);
    expect(onPress).toBeCalled();
  })

  it('should NOT call onPress when pressing on indeterminate Checkbox', () => {
    const onPress = jest.fn();
    const wrapper = renderWithRedux(<Checkbox indeterminate label="Label" onPress={onPress} testID="checkbox" />);
    const button = wrapper.getByTestId('checkbox');
    fireEvent.press(button);
    expect(onPress).not.toBeCalled();
  })

  it('should NOT call onPress when pressing on disabled Checkbox', () => {
    const onPress = jest.fn();
    const wrapper = renderWithRedux(<Checkbox disabled="disabled" isChecked label="Label" onPress={onPress} testID="checkbox" />);
    const button = wrapper.getByTestId('checkbox');
    fireEvent.press(button);
    expect(onPress).not.toBeCalled();
  })

  it('should NOT call onPress when pressing on disabled-auto-selected Checkbox', () => {
    const onPress = jest.fn();
    const wrapper = renderWithRedux(<Checkbox disabled="disabled-auto-selected" isChecked label="Label" onPress={onPress} testID="checkbox" />);
    const button = wrapper.getByTestId('checkbox');
    fireEvent.press(button);
    expect(onPress).not.toBeCalled();
  })
})
