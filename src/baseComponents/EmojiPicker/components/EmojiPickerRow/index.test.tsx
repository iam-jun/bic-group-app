import React from 'react';
import { StyleSheet } from 'react-native';
import { fireEvent, render } from '~/test/testUtils';
import EmojiPickerRow from '.';

describe('EmojiPickerRow component', () => {
  const defaultProps = {
    items: [
      {
        aliases: 'grinning',
        name: 'grinning',
      },
      {
        aliases: 'smiley',
        name: 'smiley',
      },
      {
        aliases: 'smile',
        name: 'smile',
      },
      {
        aliases: 'grin',
        name: 'grin',
      },
      {
        aliases: 'laughing',
        name: 'laughing',
      },
      {
        aliases: 'sweat_smile',
        name: 'sweat_smile',
      },
      {
        aliases: 'rolling_on_the_floor_laughing',
        name: 'rolling_on_the_floor_laughing',
      },
    ],
    emojiSize: 30,
    emojiGutter: 7,
    onEmojiPress: jest.fn(),
  };

  it('should render correctly', () => {
    const wrapper = render(<EmojiPickerRow {...defaultProps} />);

    const emojiRow = wrapper.queryByTestId('emoji_picker_row');
    const emojiButton = wrapper.queryByTestId('emoji_picker_row.emoji_button.smile');
    const firstEmojiButton = wrapper.queryByTestId('emoji_picker_row.emoji_button.grinning');
    const lastEmojiButton = wrapper.queryByTestId('emoji_picker_row.emoji_button.rolling_on_the_floor_laughing');

    expect(emojiRow).not.toBeNull();
    expect(emojiButton).not.toBeNull();
    expect(firstEmojiButton).not.toBeNull();
    expect(lastEmojiButton).not.toBeNull();

    const emojiButtonStyle = StyleSheet.flatten(emojiButton.props.style);
    const firstEmojiButtonStyle = StyleSheet.flatten(firstEmojiButton.props.style);
    const lastEmojiButtonStyle = StyleSheet.flatten(lastEmojiButton.props.style);

    expect(emojiButtonStyle.width).toEqual(37);
    expect(emojiButtonStyle.marginHorizontal).toEqual(7);
    expect(firstEmojiButtonStyle.marginLeft).toEqual(0);
    expect(lastEmojiButtonStyle.marginRight).toEqual(0);
  });

  it('should call onEmojiPress', () => {
    const onEmojiPress = jest.fn();
    const wrapper = render(<EmojiPickerRow {...defaultProps} onEmojiPress={onEmojiPress} />);

    const emojiRow = wrapper.queryByTestId('emoji_picker_row');
    const emojiButton = wrapper.queryByTestId('emoji_picker_row.emoji_button.smile');

    expect(emojiRow).not.toBeNull();
    expect(emojiButton).not.toBeNull();

    fireEvent(emojiButton, 'press');

    expect(onEmojiPress).toBeCalledWith('smile');
  });
});
