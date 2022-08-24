import { cleanup } from '@testing-library/react-native';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import SearchInput from '.';

afterEach(cleanup);

describe('SearchInput component', () => {
  it('renders correctly', () => {
    const rendered = renderWithRedux(<SearchInput />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('should show icon clear', () => {
    const rendered = renderWithRedux(
      <SearchInput testID="SearchInput" value="test" />,
    );

    const input = rendered.getByTestId('search_input.input');
    const iconClear = rendered.getByTestId('search_input.icon_clear');
    expect(input).toBeDefined();
    expect(iconClear).toBeDefined();
    fireEvent.press(iconClear);

    expect(input.props.value).toBe('');
  });

  it('should hide icon clear', () => {
    const rendered = renderWithRedux(
      <SearchInput testID="SearchInput" value="test" />,
    );

    const input = rendered.getByTestId('search_input.input');
    expect(input).toBeDefined();
    fireEvent.changeText(input, '');

    const iconClear = rendered.queryByTestId('search_input.icon_clear');

    expect(iconClear).toBeNull();
    expect(input.props.value).toBe('');
  });

  it('should call onChangeText', () => {
    const onChangeText = jest.fn();
    const rendered = renderWithRedux(
      <SearchInput testID="SearchInput" onChangeText={onChangeText} />,
    );

    const input = rendered.getByTestId('search_input.input');
    expect(input).toBeDefined();
    fireEvent(input, 'onChangeText', 'test');

    expect(onChangeText).toHaveBeenCalledWith('test');
  });

  it('should not call onSubmitEditing', () => {
    const onSubmitEditing = jest.fn();
    const rendered = renderWithRedux(
      <SearchInput testID="SearchInput" onSubmitEditing={onSubmitEditing} />,
    );

    const input = rendered.getByTestId('search_input.input');
    expect(input).toBeDefined();
    fireEvent(input, 'onSubmitEditing');

    expect(onSubmitEditing).not.toBeCalled();
  });

  it('should call onSubmitEditing', () => {
    const onSubmitEditing = jest.fn();
    const rendered = renderWithRedux(
      <SearchInput testID="SearchInput" value="test" onSubmitEditing={onSubmitEditing} />,
    );

    const input = rendered.getByTestId('search_input.input');
    expect(input).toBeDefined();
    fireEvent(input, 'onSubmitEditing');

    expect(onSubmitEditing).toHaveBeenCalled();
  });

  it('should change border color when focus', () => {
    const rendered = renderWithRedux(
      <SearchInput testID="SearchInput" />,
    );

    const inputContainer = rendered.getByTestId('search_input');
    const input = rendered.getByTestId('search_input.input');
    expect(inputContainer).toBeDefined();
    expect(input).toBeDefined();
    fireEvent(input, 'onFocus');

    const flattenedStyle = StyleSheet.flatten(inputContainer.props.style);
    expect(flattenedStyle.borderColor).toBe('#7335C0');
  });
});
