import React from 'react';
import {cleanup} from '@testing-library/react-native';

import MentionInput from '.';
import CommentInput from '../CommentInput';
import {configureStore, renderWithRedux, fireEvent} from '~/test/testUtils';
import initialState from '~/store/initialState';
import PostInput from '../PostInput';
import {StyleSheet} from 'react-native';
import {colors} from '~/theme';

afterEach(cleanup);

describe('MentionInput component', () => {
  const baseProps = {
    textInputRef: null,
    mentionInputRef: null,
    groupIds: 'groupIds',
    disabled: false,
    placeholderText: 'placeholder',

    autocompleteProps: {},
    style: null,
    textInputStyle: null,
  };

  let Platform: any;
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    Platform = require('react-native').Platform;
  });

  const mockStore = configureStore([]);

  const store = mockStore(initialState);

  it(`renders correctly`, async () => {
    const wrapper = renderWithRedux(<MentionInput {...baseProps} />, store);

    const rendered = wrapper.toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it(`should show "MentionInput" with zIndex 1`, async () => {
    const wrapper = renderWithRedux(<MentionInput {...baseProps} />, store);

    const component = wrapper.getByTestId('_mention_input');
    const flattenedStyle = StyleSheet.flatten(component.props.style);
    expect(flattenedStyle.zIndex).toBe(1);
  });

  it(`should show "MentionInput" with CommmentInput`, async () => {
    const props = {
      ...baseProps,
      ComponentInput: CommentInput,
      componentInputProps: {
        commentInputRef: null,
        value: 'value',
        autoFocus: false,
        loading: false,
        isHandleUpload: true,
        placeholder: 'placeholder',
        onChangeText: jest.fn(),
        onPressSend: jest.fn(),
      },
    };
    const wrapper = renderWithRedux(<MentionInput {...props} />, store);
    const rendered = wrapper.toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it(`should show "MentionInput" with PostInput`, async () => {
    const props = {
      ...baseProps,
      ComponentInput: PostInput,
      componentInputProps: {
        inputRef: null,
        value: 'value',
        onChangeText: jest.fn(),
      },
    };
    const wrapper = renderWithRedux(<MentionInput {...props} />, store);
    expect(wrapper).toMatchSnapshot();
  });

  it(`should show "MentionInput" with disabled input`, async () => {
    const props = {
      ...baseProps,
      disabled: true,
    };
    const wrapper = renderWithRedux(<MentionInput {...props} />, store);

    const commentInput = wrapper.getByTestId('_mention_input.input');
    expect(commentInput.props.editable).toBeFalsy();
  });

  it(`should show "MentionInput" with disabled input style`, async () => {
    const props = {
      ...baseProps,
      disabled: true,
    };
    const wrapper = renderWithRedux(<MentionInput {...props} />, store);

    const commentInput = wrapper.getByTestId('_mention_input.input');
    const flattenedStyle = StyleSheet.flatten(commentInput.props.style);
    expect(flattenedStyle.color).toBe(colors.light.colors.textSecondary);
  });

  it(`should call onChangeText`, async () => {
    const onChangeText = jest.fn();
    const props = {
      ...baseProps,
      disabled: true,
      componentInputProps: {
        onChangeText,
      },
    };
    const wrapper = renderWithRedux(<MentionInput {...props} />, store);

    const component = wrapper.getByTestId('_mention_input.input');
    fireEvent.changeText(component, 'abc');
    expect(onChangeText).toBeCalledWith('abc');
  });

  it(`should hide "ComponentInput" with hidden style on ios`, async () => {
    Platform.OS = 'ios';
    const wrapper = renderWithRedux(<MentionInput {...baseProps} />, store);

    const comonentInput = wrapper.queryByTestId('_mention_input.input.web');
    expect(comonentInput).toBeNull();
  });

  it(`should show "ComponentInput" with hidden style on web`, async () => {
    Platform.OS = 'web';
    const wrapper = renderWithRedux(<MentionInput {...baseProps} />, store);

    const comonentInput = wrapper.getByTestId('_mention_input.input.web');
    const flattenedStyle = StyleSheet.flatten(comonentInput.props.style);
    expect(flattenedStyle.height).toBe(0);
  });

  it(`should show "ComponentInput" with multiline on web`, async () => {
    Platform.OS = 'web';
    const wrapper = renderWithRedux(<MentionInput {...baseProps} />, store);

    const comonentInput = wrapper.getByTestId('_mention_input.input.web');
    expect(comonentInput.props.multiline).toBe(true);
  });

  it(`should show "MentionInput" with disabled input on web`, async () => {
    Platform.OS = 'web';
    const props = {
      ...baseProps,
      disabled: true,
    };
    const wrapper = renderWithRedux(<MentionInput {...props} />, store);

    const commentInput = wrapper.getByTestId('_mention_input.input.web');
    expect(commentInput.props.editable).toBeFalsy();
  });
});
