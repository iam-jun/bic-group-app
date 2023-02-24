import React from 'react';
import {
  act, fireEvent, render, renderHook,
} from '~/test/testUtils';
import EmojiSectionIcons from '.';
import useEmojiPickerStore from '../../store';

describe('EmojiSectionIcons component', () => {
  const defaultProps = {
    visible: true,
    onPress: jest.fn(),
  };
  let Platform: any;

  beforeEach(() => {
    jest.clearAllMocks();
    Platform = require('react-native').Platform;
    const { result } = renderHook(() => useEmojiPickerStore((state) => state));
    act(() => { result.current.actions.buildEmojis(); });
  });

  it('should render correctly', () => {
    Platform.OS = 'ios';
    const wrapper = render(<EmojiSectionIcons {...defaultProps} />);

    const emojiSectionIcons = wrapper.queryByTestId('emoji_section_icons');
    const emojiButton = wrapper.queryByTestId('emoji_section_icons.icon_0');
    const keyboardSpacer = wrapper.queryByTestId('emoji_section_icons.keyboard_spacer');

    expect(emojiSectionIcons).not.toBeNull();
    expect(emojiButton).not.toBeNull();
    expect(keyboardSpacer).not.toBeNull();
  });

  it('should render null when visible=false', () => {
    const { result } = renderHook(() => useEmojiPickerStore((state) => state));
    const wrapper = render(<EmojiSectionIcons {...defaultProps} visible={false} />);
    const emojiSectionIcons = wrapper.queryByTestId('emoji_section_icons');

    expect(emojiSectionIcons).toBeNull();
    expect(result.current.filteredData).toBeNull();
    expect(result.current.currentSectionIndex).toEqual(0);
  });

  it('should render null when searching', () => {
    const wrapper = render(<EmojiSectionIcons {...defaultProps} />);

    const { result } = renderHook(() => useEmojiPickerStore((state) => state));
    act(() => { result.current.actions.search('smile'); });

    const emojiSectionIcons = wrapper.queryByTestId('emoji_section_icons');

    expect(emojiSectionIcons).toBeNull();
  });

  it('should call onPress', () => {
    const onPress = jest.fn();
    const wrapper = render(<EmojiSectionIcons {...defaultProps} onPress={onPress} />);

    const emojiRow = wrapper.queryByTestId('emoji_section_icons');
    const emojiButton = wrapper.queryByTestId('emoji_section_icons.icon_2');

    expect(emojiRow).not.toBeNull();
    expect(emojiButton).not.toBeNull();

    fireEvent(emojiButton, 'press');

    expect(onPress).toBeCalledWith(2);
  });

  it('should hide KeyboardSpacer on android', () => {
    Platform.OS = 'android';
    const wrapper = render(<EmojiSectionIcons {...defaultProps} />);

    const keyboardSpacer = wrapper.queryByTestId('emoji_section_icons.keyboard_spacer');

    expect(keyboardSpacer).toBeNull();
  });
});
