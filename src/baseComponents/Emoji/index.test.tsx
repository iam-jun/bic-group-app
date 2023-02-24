import React from 'react';
import { StyleSheet } from 'react-native';
import { render } from '~/test/testUtils';
import Emoji from '.';

describe('Emoji component', () => {
  let Platform: any;

  beforeEach(() => {
    jest.clearAllMocks();
    Platform = require('react-native').Platform;
  });

  it('should render custom emoji', () => {
    Platform.OS = 'android';
    const size = 20;
    const width = size * 1.2;
    const height = size * 1.2;

    const wrapper = render(<Emoji emojiName="bic_check_mark" size={size} />);

    const customEmoji = wrapper.queryByTestId('emoji.image');
    const flattenedStyle = StyleSheet.flatten(customEmoji.props.style);

    expect(customEmoji).not.toBeNull();
    expect(flattenedStyle.width).toEqual(width);
    expect(flattenedStyle.height).toEqual(height);
  });

  it('should render unicode emoji', () => {
    const wrapper = render(<Emoji emojiName="smile" size={20} />);

    const unicodeEmoji = wrapper.queryByTestId('emoji.unicode');
    const flattenedStyle = StyleSheet.flatten(unicodeEmoji.props.style);

    expect(unicodeEmoji).not.toBeNull();
    expect(flattenedStyle.fontSize).toEqual(20);
  });

  it('should render null', () => {
    const wrapper = render(<Emoji emojiName="smilesmilesmile" size={20} />);
    const unicodeEmoji = wrapper.queryByTestId('emoji.unicode');
    const customEmoji = wrapper.queryByTestId('emoji.image');

    expect(unicodeEmoji).toBeNull();
    expect(customEmoji).toBeNull();
  });
});
