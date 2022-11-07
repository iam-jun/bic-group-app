import { useKeyboard } from '@react-native-community/hooks';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { debounce } from 'lodash';
import React, {
  useCallback, useEffect, useImperativeHandle, useRef,
} from 'react';
import {
  Keyboard, Platform, StyleSheet, View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Portal } from 'react-native-portalize';
import { AppConfig } from '~/configs';
import { dimension } from '~/theme';
import spacing from '~/theme/spacing';
import EmojiSectionIcons from '~/baseComponents/EmojiPicker/components/EmojiSectionIcons';
import EmojiPicker from '~/baseComponents/EmojiPicker';
import useEmojiPickerStore from '~/baseComponents/EmojiPicker/store';
import IEmojiPickerState from '~/baseComponents/EmojiPicker/store/Interface';
import { SearchInput } from '~/baseComponents/Input';
import { useBaseHook } from '~/hooks';
import GiphyView from '../GiphyView';
import { IGiphy } from '~/interfaces/IGiphy';
import SlideUpModal from '../SlideUpModal';

export interface Props {
  stickerViewRef: any;
  onGiphySelected?: (media: IGiphy) => void;
  onEmojiSelected?: (emoji: string) => void;

}

const _StickerView = ({ stickerViewRef, onGiphySelected, onEmojiSelected }: Props) => {
  const { t } = useBaseHook();
  const INITIAL_KEYBOARD_HEIGHT = 336;
  const modalizeRef = useRef<any>();

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

  useEffect(
    () => {
      if (keyboard?.keyboardHeight
      && keyboardHeight !== keyboard?.keyboardHeight
      && keyboard?.keyboardHeight > INITIAL_KEYBOARD_HEIGHT
      ) {
        setKeyboardHeight(keyboard?.keyboardHeight);
      }
    }, [keyboard?.keyboardHeight],
  );

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  const show = (type:'gif'|'emoji') => {
    setType(type);
    modalizeRef.current?.show();
    Keyboard.dismiss();
  };

  const hide = () => {
    modalizeRef.current?.hide();
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

  const expandHeight = Platform.OS === 'ios' ? keyboardHeight : undefined;
  const maxHeight = Platform.OS === 'android' ? keyboardHeight : undefined;
  const topOffset = Platform.OS === 'ios' ? dimension.headerHeight : undefined;

  return (
    <View testID="sticker_view" style={styles.container}>
      <Animated.View style={animatedStyle} />
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
          <View style={[styles.stickerView]}>
            <View style={styles.header}>
              <SearchInput
                testID="sticker_view.search_input"
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
StickerView.whyDidYouRender = true;
export default StickerView;
