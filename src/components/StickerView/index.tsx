import { useKeyboard } from '@react-native-community/hooks';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { debounce } from 'lodash';
import React, {
  useCallback, useEffect, useImperativeHandle, useRef,
} from 'react';
import {
  Keyboard, Platform, StyleSheet, TextInput, View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Portal } from 'react-native-portalize';
import EmojiPicker from '~/baseComponents/EmojiPicker';
import EmojiSectionIcons from '~/baseComponents/EmojiPicker/components/EmojiSectionIcons';
import useEmojiPickerStore, { IEmojiPickerState } from '~/baseComponents/EmojiPicker/store';
import { SearchInput } from '~/baseComponents/Input';
import { AppConfig } from '~/configs';
import { useBaseHook } from '~/hooks';
import { IGiphy } from '~/interfaces/IGiphy';
import { dimension } from '~/theme';
import spacing from '~/theme/spacing';
import GiphyView from '../GiphySelectorView';
import SlideUpModal from '../SlideUpModal';

export interface Props {
  stickerViewRef: any;
  fullscreen?: boolean;
  hideOnBlur?: boolean;
  onGiphySelected?: (media: IGiphy) => void;
  onEmojiSelected?: (emoji: string) => void;
  onVisibleChanged?: (visible: boolean) => void;
}

const _StickerView = ({
  stickerViewRef, fullscreen, hideOnBlur, onGiphySelected, onEmojiSelected, onVisibleChanged,
}: Props) => {
  const { t } = useBaseHook();
  const INITIAL_KEYBOARD_HEIGHT = 336;
  const modalizeRef = useRef<any>();
  const searchInputRef = useRef<TextInput>();

  const [type, setType] = React.useState('emoji');
  const [visible, setVisible] = React.useState(false);
  const [keyboardHeight, setKeyboardHeight] = React.useState(INITIAL_KEYBOARD_HEIGHT);
  const [searchQuery, setSearchQuery] = React.useState('');
  const _stickerViewRef = stickerViewRef || useRef();
  const emojiPickerRef: any = useRef();

  const actions = useEmojiPickerStore((state: IEmojiPickerState) => state.actions);

  const height = useSharedValue(0);

  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const keyboard = useKeyboard();

  useEffect(() => onVisibleChanged?.(visible), [visible]);

  useEffect(() => {
    const shoultInitialize = keyboard?.keyboardHeight
      && keyboardHeight !== keyboard?.keyboardHeight
      && keyboard?.keyboardHeight > INITIAL_KEYBOARD_HEIGHT;

    if (shoultInitialize) {
      setKeyboardHeight(keyboard?.keyboardHeight);
    }
  }, [keyboard?.keyboardHeight]);

  useEffect(() => {
    const isSearchInputFocused = searchInputRef.current?.isFocused();

    if (hideOnBlur && keyboard?.keyboardShown && !isSearchInputFocused) {
      hide(true);
    }
  }, [keyboard?.keyboardShown]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  const show = (type:'gif'|'emoji', autofocus?: boolean) => {
    setType(type);
    modalizeRef.current?.show();
    if (autofocus) {
      searchInputRef.current?.focus();
    } else {
      Keyboard.dismiss();
    }
  };

  const hide = (urgent?: boolean) => {
    if (urgent) height.value = 0;
    modalizeRef.current?.hide(urgent);
  };

  const onChangeText = debounce(
    (value: string) => {
      if (type === 'giphy') {
        setSearchQuery(value);
      } else {
        actions.search(value);
      }
    }, AppConfig.searchTriggerTime,
  );

  const onGiphyPress = (item: IGiphy) => {
    onGiphySelected(item);
  };

  const onEmojiPress = useCallback((emojiName: string) => {
    onEmojiSelected(emojiName);
  }, []);

  const onOpened = () => {
    setVisible(true);

    height.value = withTiming(
      keyboardHeight, { duration: 400 },
    );
  };

  const onClosed = () => {
    setVisible(false);
    setSearchQuery('');

    height.value = withTiming(
      0, { duration: 200 },
    );
  };

  const onCollapsed = () => Keyboard.dismiss();

  const onSearchFocus = () => {
    if (Platform.OS === 'android') return;

    modalizeRef.current?.maximise();
  };

  const onSearchBlur = () => {
    //
  };

  const onBackPress = () => {
    hide();
    return true;
  };

  useImperativeHandle(
    _stickerViewRef, () => ({
      show,
      hide,
      onBackPress,
    }),
  );

  const scrollToSectionIndex = (index: number) => {
    emojiPickerRef.current?.scrollToSectionIndex(index);
  };

  let content = null;

  if (type === 'giphy') {
    content = <GiphyView searchQuery={searchQuery} onSelected={onGiphyPress} />;
  } else if (type === 'emoji') {
    content = (
      <View style={styles.emojiView}>
        <EmojiPicker
          emojiPickerRef={emojiPickerRef}
          onEmojiPress={onEmojiPress}
        />
        <EmojiSectionIcons
          visible={visible}
          onPress={scrollToSectionIndex}
        />
      </View>
    );
  }

  const expandHeight = Platform.OS === 'ios' && !fullscreen ? keyboardHeight : undefined;
  const maxHeight = Platform.OS === 'android' && !fullscreen ? keyboardHeight : undefined;
  const topOffset = Platform.OS === 'ios' && !fullscreen ? dimension.headerHeight : undefined;

  return (
    <View testID="sticker_view" style={styles.container}>
      <Portal>
        <SlideUpModal
          sheetRef={modalizeRef}
          topOffset={topOffset}
          maxHeight={maxHeight}
          expandHeight={expandHeight}
          onOpened={onOpened}
          onClosed={onClosed}
          onCollapsed={onCollapsed}
        >
          <View style={styles.stickerView}>
            <View style={styles.header}>
              <SearchInput
                testID="sticker_view.search_input"
                inputRef={searchInputRef}
                placeholder={t(`sticker:search_${type}`)}
                value={searchQuery}
                onChangeText={onChangeText}
                onFocus={onSearchFocus}
                onBlur={onSearchBlur}
              />
            </View>
            {content}
          </View>
        </SlideUpModal>
      </Portal>
      <Animated.View style={animatedStyle} />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      backgroundColor: colors.white,
    },
    stickerView: {
      height: '100%',
    },
    emojiView: {
      flex: 1,
    },
    header: {
      paddingVertical: spacing.margin.base,
      marginHorizontal: spacing.margin.base,
    },
    gridView: {
      height: '100%',
    },
    loading: {
      marginTop: spacing.margin.base,
    },
  });
};

const StickerView = React.memo(_StickerView);
// StickerView.whyDidYouRender = true;
export default StickerView;
