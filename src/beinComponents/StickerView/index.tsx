import {GiphyContent, GiphyGridView, GiphyMedia} from '@giphy/react-native-sdk';
import i18next from 'i18next';
import {useKeyboard} from '@react-native-community/hooks';
import React, {useEffect, useImperativeHandle, useRef} from 'react';
import {
  DeviceEventEmitter,
  Keyboard,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import {
  Directions,
  FlingGestureHandler,
  FlingGestureHandlerStateChangeEvent,
  State,
} from 'react-native-gesture-handler';
import {useTheme} from 'react-native-paper';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {dimension} from '~/theme';
import {ITheme} from '~/theme/interfaces';
import {EmojiBoardProps} from '../emoji/EmojiBoard';
import SearchInput from '../inputs/SearchInput';
import KeyboardSpacer from '~/beinComponents/KeyboardSpacer';

export interface Props extends Partial<EmojiBoardProps> {
  stickerViewRef: any;
  onMediaSelect: (media: GiphyMedia) => void;
}

const _StickerView = ({stickerViewRef, onMediaSelect}: Props) => {
  const INITIAL_KEYBOARD_HEIGHT = 336;
  const [visible, setVisible] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [keyboardHeight, setKeyboardHeight] = React.useState(
    INITIAL_KEYBOARD_HEIGHT,
  );
  const [searchQuery, setSearchQuery] = React.useState('');
  const _stickerViewRef = stickerViewRef || useRef();

  const request = searchQuery
    ? GiphyContent.search({searchQuery: searchQuery})
    : GiphyContent.trending({mediaType: undefined});

  const height = useSharedValue(0);

  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);
  const insets = useSafeAreaInsets();

  const keyboard = useKeyboard();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(
        height.value,
        [0, keyboardHeight],
        [0, keyboardHeight],
      ),
    };
  });

  useEffect(() => {
    if (
      keyboard?.keyboardHeight &&
      keyboardHeight !== keyboard?.keyboardHeight
    ) {
      setKeyboardHeight(keyboard?.keyboardHeight);
    }
  }, [keyboard?.keyboardHeight]);

  useEffect(() => {
    DeviceEventEmitter.emit('sticker-board-visible-change', visible);
  }, [visible]);

  const show = () => {
    if (visible) return;

    setVisible(true);
    Keyboard.dismiss();
    const _height = Math.max(keyboardHeight, INITIAL_KEYBOARD_HEIGHT);
    height.value = withTiming(_height, {
      duration: 200,
    });
  };

  const expand = () => {
    setIsExpanded(true);
    // height.value = withTiming(dimension.deviceHeight, {duration: 200});
  };

  const collapse = () => {
    Keyboard.dismiss();
    setIsExpanded(false);
  };

  const hide = () => {
    const onHideDone = () => {
      setVisible(false);
      setIsExpanded(false);
      setSearchQuery('');
    };
    height.value = withTiming(0, {duration: 200}, () => {
      runOnJS(onHideDone)();
    });
  };

  const hideImmediately = () => {
    setVisible(false);
    runOnJS(hide)();
  };

  const handleDown = () => {
    if (isExpanded) runOnJS(collapse)();
    else runOnJS(hide)();
  };

  const handleUp = () => {
    runOnJS(expand)();
  };

  const getVisible = () => {
    return visible;
  };

  useImperativeHandle(_stickerViewRef, () => ({
    show,
    hide,
    hideImmediately,
    onBackPress: handleDown,
    getVisible,
  }));

  const onDownFlingHandlerStateChange = ({
    nativeEvent,
  }: FlingGestureHandlerStateChangeEvent) => {
    if (nativeEvent.oldState === State.ACTIVE) {
      runOnJS(handleDown)();
    }
  };

  const onUpFlingHandlerStateChange = ({
    nativeEvent,
  }: FlingGestureHandlerStateChangeEvent) => {
    if (nativeEvent.oldState === State.ACTIVE) {
      runOnJS(handleUp)();
    }
  };

  const onSearchFocus = () => {
    setIsExpanded(true);
  };

  const _onMediaSelect = (
    e: NativeSyntheticEvent<{
      media: GiphyMedia;
    }>,
  ) => {
    onMediaSelect(e.nativeEvent.media);
  };

  if (!visible) return null;

  const offset = dimension.headerHeight + insets.top + keyboardHeight;

  const contentHeight = dimension.deviceHeight - offset;

  const _animatedStyle = isExpanded
    ? styles.animatedViewExpanded
    : animatedStyle;

  return (
    <FlingGestureHandler
      direction={Directions.DOWN}
      onEnded={handleDown}
      onHandlerStateChange={onDownFlingHandlerStateChange}>
      <View
        testID="sticker_view"
        style={[
          {
            height: contentHeight,
          },
          isExpanded && {
            ...styles.expanded,
            bottom: Platform.OS === 'android' ? 0 : keyboardHeight,
          },
        ]}>
        <Animated.View
          testID="sticker_view.animated_view"
          style={_animatedStyle}>
          <View style={styles.stickerView}>
            <FlingGestureHandler
              direction={Directions.UP}
              onEnded={handleUp}
              onHandlerStateChange={onUpFlingHandlerStateChange}>
              <View style={styles.header}>
                <View style={styles.indicator} />
                <SearchInput
                  testID="sticker_view.search_input"
                  placeholder={i18next.t('post:comment:search_giphy')}
                  value={searchQuery}
                  onFocus={onSearchFocus}
                  onChangeText={setSearchQuery}
                />
              </View>
            </FlingGestureHandler>
            <GiphyGridView
              testID="sticker_view.grid_view"
              content={request}
              cellPadding={4}
              style={styles.gridView}
              onMediaSelect={_onMediaSelect}
            />
          </View>
        </Animated.View>
        {Platform.OS === 'android' && visible && (
          <KeyboardSpacer testID="sticker_view.keyboard_spacer" />
        )}
      </View>
    </FlingGestureHandler>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    expanded: {
      position: 'absolute',
      left: 0,
      right: 0,
      zIndex: 99,
    },
    header: {
      paddingVertical: spacing.margin.base,
      marginHorizontal: spacing.margin.base,
    },
    indicator: {
      backgroundColor: colors.borderDivider,
      width: 48,
      height: 4,
      borderRadius: 4,
      alignSelf: 'center',
      marginBottom: spacing.margin.base,
    },
    stickerView: {
      borderTopWidth: 1,
      borderTopColor: colors.borderDivider,
      backgroundColor: colors.background,
      height: '100%',
    },
    animatedViewExpanded: {
      height: '100%',
    },
    gridView: {
      height: '100%',
    },
  });
};

const StickerView = React.memo(_StickerView);
// StickerView.whyDidYouRender = true;
export default StickerView;
