import { useKeyboard } from '@react-native-community/hooks';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { debounce } from 'lodash';
import React, { useEffect, useImperativeHandle, useRef } from 'react';
import {
  Keyboard, Platform, StyleSheet, View,
} from 'react-native';
import { Modalize } from 'react-native-modalize';
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

export interface Props {
  stickerViewRef: any;
  onGifSelected?: (media: IGiphy) => void;
  onEmojiSelected?: (emoji: string) => void;

}

const _StickerView = ({ stickerViewRef, onGifSelected, onEmojiSelected }: Props) => {
  const { t } = useBaseHook();
  const INITIAL_KEYBOARD_HEIGHT = 336;
  const modalizeRef = useRef<Modalize>();

  const [type, setType] = React.useState('emoji');
  const [visible, setVisible] = React.useState(false);
  const [keyboardHeight, setKeyboardHeight] = React.useState(INITIAL_KEYBOARD_HEIGHT);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [modalTopOffset, setModalTopOffset] = React.useState(0);
  const _stickerViewRef = stickerViewRef || useRef();
  const emojiPickerRef: any = useRef();

  const androidHeight = dimension.deviceHeight / 2;
  const [showAndroidHeight, setShowAndroidHeight] = React.useState(false);

  const isIOS = Platform.OS === 'ios';

  const actions = useEmojiPickerStore((state: IEmojiPickerState) => state.actions);

  const height = useSharedValue(0);

  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const keyboard = useKeyboard();
  useEffect(
    () => {
      if (
        keyboard?.keyboardHeight
      && keyboardHeight !== keyboard?.keyboardHeight
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
    modalizeRef.current?.open('default');
    Keyboard.dismiss();
  };

  const hide = () => {
    modalizeRef.current?.close();
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

  const onGifPress = (item: IGiphy) => {
    onGifSelected(item);
  };

  const onEmojiPress = (emojiName: string) => {
    onEmojiSelected(emojiName);
  };

  // Only trigger when opend, closed event is not triggered
  const onPositionChange = (position: 'top' | 'initial') => {
    setModalTopOffset(position === 'top' ? dimension.headerHeight : 0);
  };

  const onOpen = () => {
    setVisible(true);

    // For iOS
    if (!isIOS) return;

    setTimeout(
      () => {
        height.value = withTiming(
          keyboardHeight, { duration: 400 },
        );
      }, 200,
    );
  };

  const onOpened = () => {
    // For android
    if (isIOS) return;

    height.value = withTiming(
      keyboardHeight, { duration: 400 },
    );
  };

  const onClose = () => {
    setVisible(false);
    setSearchQuery('');

    // reset position
    onPositionChange('initial');
    setShowAndroidHeight(false);

    height.value = withTiming(
      0, { duration: 200 },
    );
  };

  const onSearchFocus = () => {
    if (!isIOS) {
      // Can't show modalize fullscreen on Android
      // Because of keyboard behavior
      setShowAndroidHeight(true);
      return;
    }
    // trigger before modal reach the top to make app looks smooth
    onPositionChange('top');
    modalizeRef.current?.open('top');
  };

  const onSearchBlur = () => {
    if (!isIOS) {
      setShowAndroidHeight(false);
    }
  };

  const onBackPress = () => {
    hide();
    return true;
  };

  useImperativeHandle(
    _stickerViewRef, () => ({
      show,
      hide,
      onBackPress: hide,
    }),
  );

  const scrollToSectionIndex = (index: number) => {
    emojiPickerRef.current?.scrollToSectionIndex(index);
  };

  const renderComponent = () => {
    if (type === 'giphy') {
      return <GiphyView searchQuery={searchQuery} onSelected={onGifPress} />;
    }

    return (
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
  };

  const containerHeight = showAndroidHeight ? androidHeight : keyboardHeight;

  return (
    <View testID="sticker_view" style={styles.container}>
      <Animated.View style={animatedStyle} />
      <Portal>
        <Modalize
          ref={modalizeRef}
          handlePosition="inside"
          adjustToContentHeight={!isIOS}
          disableScrollIfPossible={isIOS}
          modalTopOffset={modalTopOffset}
          closeSnapPointStraightEnabled={false}
          withOverlay={isIOS && modalTopOffset !== 0}
          snapPoint={isIOS ? keyboardHeight : undefined}
          scrollViewProps={{
            keyboardShouldPersistTaps: 'handled',
            keyboardDismissMode: 'interactive',
            contentContainerStyle: {
              height: isIOS ? '100%' : containerHeight,
            },
          }}
          onOpen={onOpen}
          onOpened={onOpened}
          onClose={onClose}
          onBackButtonPress={onBackPress}
          onPositionChange={onPositionChange}
        >
          <View style={[styles.stickerView, !isIOS && { height: containerHeight }]}>
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
            {renderComponent()}
          </View>
        </Modalize>
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
      marginTop: spacing.margin.small,
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
