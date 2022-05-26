import {GiphyContent, GiphyGridView, GiphyMedia} from '@giphy/react-native-sdk';
import i18next from 'i18next';
import {useKeyboard} from '@react-native-community/hooks';
import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
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
  const [visible, setVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(INITIAL_KEYBOARD_HEIGHT);
  const _stickerViewRef = stickerViewRef || useRef();
  const [searchQuery, setSearchQuery] = useState<string>('');

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
    setVisible(true);
    Keyboard.dismiss();
    const _height = Math.max(keyboardHeight, INITIAL_KEYBOARD_HEIGHT);
    height.value = withTiming(_height, {
      duration: 200,
    });
  };

  const expand = () => {
    setIsExpanded(true);
    height.value = withTiming(dimension.deviceHeight, {duration: 200});
  };

  const colapse = () => {
    Keyboard.dismiss();
    const _height = Math.max(keyboardHeight, INITIAL_KEYBOARD_HEIGHT);
    height.value = withTiming(_height, {duration: 200});
    setIsExpanded(false);
  };

  const hide = () => {
    const onHideDone = () => {
      setVisible(false);
    };
    height.value = withTiming(0, {duration: 200}, () => {
      runOnJS(onHideDone)();
    });
  };

  const hideImmediately = () => {
    setVisible(false);
    height.value = 0;
  };

  const handleDown = () => {
    if (isExpanded) runOnJS(colapse)();
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

  // if (!visible) return null;

  const offset = dimension.headerHeight + insets.top + keyboardHeight;

  const contentHeight = dimension.deviceHeight - offset;

  return (
    <FlingGestureHandler
      direction={Directions.DOWN}
      onEnded={handleDown}
      onHandlerStateChange={onDownFlingHandlerStateChange}>
      <View
        style={[
          isExpanded && {
            ...styles.expanded,
            height: contentHeight,
            bottom: Platform.OS === 'android' ? 0 : keyboardHeight,
          },
        ]}>
        <Animated.View
          style={[isExpanded ? styles.animatedViewExpanded : animatedStyle]}>
          <View style={styles.stickerView}>
            <FlingGestureHandler
              direction={Directions.UP}
              onEnded={handleUp}
              onHandlerStateChange={onUpFlingHandlerStateChange}>
              <View style={styles.header}>
                <View style={styles.indicator} />
                <SearchInput
                  placeholder={i18next.t('post:comment:search_giphy')}
                  value={searchQuery}
                  onFocus={onSearchFocus}
                  onChangeText={setSearchQuery}
                />
              </View>
            </FlingGestureHandler>
            <GiphyGridView
              content={request}
              cellPadding={4}
              style={styles.gridView}
              onMediaSelect={_onMediaSelect}
            />
          </View>
        </Animated.View>
        {Platform.OS === 'android' && visible && <KeyboardSpacer />}
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
      zIndex: 3,
      backgroundColor: 'pink',
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
