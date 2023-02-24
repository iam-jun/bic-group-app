import React, { useRef, useState } from 'react';
import {
  act, fireEvent, render, renderHook,
} from '~/test/testUtils';
import EmojiPicker from '.';
import useEmojiPickerStore from './store';

describe('EmojiPicker component', () => {
  const defaultProps = {
    onEmojiPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    const { result } = renderHook(() => useEmojiPickerStore((state) => state));
    act(() => { result.current.actions.buildEmojis(); });
  });

  it('should render correctly', () => {
    const wrapper = render(<EmojiPicker {...defaultProps} />);

    const sectionListComponent = wrapper.queryByTestId('emoji_picker.section_list');

    expect(sectionListComponent).not.toBeNull();
  });

  it('should render filtered list', () => {
    const wrapper = render(<EmojiPicker {...defaultProps} />);
    const { result } = renderHook(() => useEmojiPickerStore((state) => state));

    act(() => { result.current.actions.search('smile'); });

    const sectionListComponent = wrapper.queryByTestId('emoji_picker.section_list');
    const flatListComponent = wrapper.queryByTestId('emoji_picker.flat_list');

    expect(sectionListComponent).toBeNull();
    expect(flatListComponent).not.toBeNull();
  });

  it('should render empty flat list', () => {
    const wrapper = render(<EmojiPicker {...defaultProps} />);
    const { result } = renderHook(() => useEmojiPickerStore((state) => state));

    act(() => { result.current.actions.search('22334455'); });

    const sectionListComponent = wrapper.queryByTestId('emoji_picker.section_list');
    const flatListComponent = wrapper.queryByTestId('emoji_picker.flat_list');
    const emptyFlatListComponent = wrapper.queryByTestId('emoji_picker.flat_list_empty');

    expect(sectionListComponent).toBeNull();
    expect(flatListComponent).not.toBeNull();
    expect(emptyFlatListComponent).not.toBeNull();
  });

  it('should call onEmojiPress', () => {
    const onEmojiPress = jest.fn();
    const emojiName = 'bic_check_mark';
    const { result } = renderHook(() => useEmojiPickerStore((state) => state));

    const wrapper = render(<EmojiPicker onEmojiPress={onEmojiPress} />);

    const sectionListComponent = wrapper.queryByTestId('emoji_picker.section_list');
    const emojiComponent = wrapper.queryByTestId(`emoji_picker_row.emoji.${emojiName}`);

    expect(sectionListComponent).not.toBeNull();
    expect(emojiComponent).not.toBeNull();
    fireEvent(emojiComponent, 'press');
    expect(onEmojiPress).toBeCalledWith(emojiName);
    expect(result.current.recentlyData).toContain(emojiName);
  });

  it('should call onSearchEmojiPress', () => {
    const onEmojiPress = jest.fn();
    const emojiName = 'bic_check_mark';
    const { result } = renderHook(() => useEmojiPickerStore((state) => state));
    act(() => { result.current.actions.search('bic'); });

    const wrapper = render(<EmojiPicker onEmojiPress={onEmojiPress} />);

    const flatListComponent = wrapper.queryByTestId('emoji_picker.flat_list');
    const emojiComponent = wrapper.queryByTestId(`emoji_picker.flat_list_item.${emojiName}`);

    expect(flatListComponent).not.toBeNull();
    expect(emojiComponent).not.toBeNull();
    fireEvent(emojiComponent, 'press');
    expect(onEmojiPress).toBeCalledWith(emojiName);
    expect(result.current.recentlyData).toContain(emojiName);
    expect(result.current.filteredData).toBeNull();
    expect(result.current.currentSectionIndex).toEqual(0);
  });

  it('should set currentSectionIndex when list scroll', () => {
    const eventData = {
      nativeEvent: {
        contentOffset: {
          y: 500,
        },
        contentSize: {
          // Dimensions of the scrollable content
          height: 500,
          width: 100,
        },
        layoutMeasurement: {
          // Dimensions of the device
          height: 100,
          width: 100,
        },
      },
    };

    const { result: state } = renderHook(() => useState((state) => state));
    const { result: store } = renderHook(() => useEmojiPickerStore((state) => state));
    act(() => { state.current[1](true); });

    const wrapper = render(<EmojiPicker {...defaultProps} />);

    const sectionListComponent = wrapper.queryByTestId('emoji_picker.section_list');

    fireEvent.scroll(sectionListComponent, eventData);

    expect(store.current.currentSectionIndex).toBeGreaterThan(0);
  });

  it('should call ref scrollToSectionIndex', () => {
    const { result: ref } = renderHook(() => useRef());
    const { result: store } = renderHook(() => useEmojiPickerStore((state) => state));

    render(<EmojiPicker {...defaultProps} emojiPickerRef={ref.current} />);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ref.current?.current?.scrollToSectionIndex?.(4);

    expect(store.current.currentSectionIndex).toEqual(4);
  });
});
