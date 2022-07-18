import {cleanup, fireEvent, render} from '@testing-library/react-native';
import React from 'react';
import {StyleSheet} from 'react-native';
import {colors, spacing} from '~/theme';
import TextInput from './TextInput';

afterEach(cleanup);

describe('TextInput component', () => {
  it(`renders correctly`, async () => {
    const wrapper = render(<TextInput />);

    const rendered = wrapper.toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it(`should show "TextInput" with right spacing`, async () => {
    const wrapper = render(<TextInput />);

    const component = wrapper.getByTestId('text_input');

    const flattenedStyle = StyleSheet.flatten(component.props.style);
    expect(flattenedStyle.marginVertical).toBe(spacing.margin.tiny);
  });

  it(`should show "TextInput" disabled`, async () => {
    const props = {
      disabled: true,
    };
    const wrapper = render(<TextInput {...props} />);

    const component = wrapper.getByTestId('text_input.input');

    expect(component.props.disabled).toBeTruthy();
    expect(component.props.theme.colors.white).toBe(colors.light.colors.gray20);
  });

  it(`onChangeText should be called`, async () => {
    const onChangeText = jest.fn();
    const props = {
      onChangeText,
    };
    const wrapper = render(<TextInput {...props} />);

    const component = wrapper.getByTestId('text_input.input');

    fireEvent.changeText(component);
    expect(onChangeText).toBeCalled();
  });

  it(`should show "TextInput" with text helper`, async () => {
    const props = {
      value: 'test',
      helperContent: 'helperContent',
    };
    const wrapper = render(<TextInput {...props} />);

    const component = wrapper.getByTestId('text_input.text_helper');
    const flattenedStyle = StyleSheet.flatten(component.props.style);
    expect(component).not.toBeNull();
    expect(flattenedStyle.color).toBe(colors.light.colors.gray50);
  });

  it(`should show "TextInput" with text helper in error`, async () => {
    const props = {
      value: 'test',
      helperContent: 'helperContent',
      error: true,
    };
    const wrapper = render(<TextInput {...props} />);
    const component = wrapper.getByTestId('text_input.input');

    expect(component.props.theme.colors.neutral80).toBe(
      colors.light.colors.red60,
    );
    const textHelper = wrapper.getByTestId('text_input.text_helper');
    const flattenedStyle = StyleSheet.flatten(textHelper.props.style);
    expect(textHelper).not.toBeNull();
    expect(flattenedStyle.color).toBe(colors.light.colors.red60);
  });

  it(`should show "TextInput" with text helper action`, async () => {
    const helperActionOnPress = jest.fn();
    const props = {
      value: 'test',
      helperContent: 'helperContent',
      helperAction: 'helperAction',
      helperActionOnPress,
    };
    const wrapper = render(<TextInput {...props} />);

    const component = wrapper.getByTestId('text_input.text_helper_action');

    expect(component).not.toBeNull();
    fireEvent.press(component);
    expect(helperActionOnPress).toBeCalledTimes(1);
  });
});
