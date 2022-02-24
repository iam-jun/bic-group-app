import React from 'react';
import {cleanup} from '@testing-library/react-native';

import _MentionInput from '.';
import CommentInput from '../CommentInput';
import {configureStore, renderWithRedux, fireEvent} from '~/test/testUtils';
import initialState from '~/store/initialState';
import PostInput from '../PostInput';
import {StyleSheet} from 'react-native';
import {colors} from '~/theme';

afterEach(cleanup);

describe('_MentionInput component', () => {
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

  const mockStore = configureStore([]);

  const store = mockStore(initialState);

  it(`renders correctly`, async () => {
    const wrapper = renderWithRedux(<_MentionInput {...baseProps} />, store);

    const rendered = wrapper.toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it(`should show "_MentionInput" with CommmentInput`, async () => {
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
    const wrapper = renderWithRedux(<_MentionInput {...props} />, store);

    const commentInput = wrapper.getByTestId('comment_input');
    expect(commentInput).not.toBeNull();
  });

  it(`should show "_MentionInput" with PostInput`, async () => {
    const props = {
      ...baseProps,
      ComponentInput: PostInput,
      componentInputProps: {
        inputRef: null,
        value: 'value',
        onChangeText: jest.fn(),
      },
    };
    const wrapper = renderWithRedux(<_MentionInput {...props} />, store);

    const postInput = wrapper.findByTestId('post_input');
    expect(postInput).not.toBeNull();
  });

  it(`should show "_MentionInput" with disabled input`, async () => {
    const props = {
      ...baseProps,
      disabled: true,
    };
    const wrapper = renderWithRedux(<_MentionInput {...props} />, store);

    const commentInput = wrapper.getByTestId('_mention_input.input');
    expect(commentInput.props.editable).toBeFalsy();
  });

  it(`should show "_MentionInput" with disabled input style`, async () => {
    const props = {
      ...baseProps,
      disabled: true,
    };
    const wrapper = renderWithRedux(<_MentionInput {...props} />, store);

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
    const wrapper = renderWithRedux(<_MentionInput {...props} />, store);

    const commentInput = wrapper.getByTestId('_mention_input.input');
    fireEvent.changeText(commentInput);
    expect(onChangeText).toHaveBeenCalled();
  });
});
