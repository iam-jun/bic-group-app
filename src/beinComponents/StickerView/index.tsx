import {GiphyContent, GiphyGridView, GiphyMedia} from '@giphy/react-native-sdk';
import i18next from 'i18next';
import {useKeyboard} from '@react-native-community/hooks';
import React, {useEffect, useImperativeHandle, useMemo, useRef} from 'react';
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
import LoadingIndicator from '../LoadingIndicator';

export interface Props extends Partial<EmojiBoardProps> {
  stickerViewRef: any;
  onMediaSelect: (media: GiphyMedia) => void;
}

const SEARCH_BAR_HEIGHT = 80;

const _StickerView = ({stickerViewRef, onMediaSelect}: Props) => {
  const INITIAL_KEYBOARD_HEIGHT = 336;
  const [visible, setVisible] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [keyboardHeight, setKeyboardHeight] = React.useState(
    INITIAL_KEYBOARD_HEIGHT,
  );
  const [searchQuery, setSearchQuery] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const _stickerViewRef = stickerViewRef || useRef();

  const request = searchQuery
    ? GiphyContent.search({searchQuery: searchQuery})
    : GiphyContent.trending({mediaType: undefined});

  const height = useSharedValue(0);

  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);
  const insets = useSafeAreaInsets();

  const keyboard = useKeyboard();

  const calculateContentHeight = useMemo(() => {
    const offset = dimension.headerHeight + insets.top + keyboardHeight;

    return dimension.deviceHeight - offset;
  }, [keyboardHeight]);

  const calculateFullHeight = useMemo(() => {
    const offset = dimension.headerHeight + insets.top;

    return dimension.deviceHeight - offset;
  }, [dimension.deviceHeight]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      // height: interpolate(
      //   height.value,
      //   [0, keyboardHeight + SEARCH_BAR_HEIGHT],
      //   [0, keyboardHeight + SEARCH_BAR_HEIGHT],
      // ),
      height: height.value,
    };
  });

  useEffect(() => {
    if (
      keyboard?.keyboardHeight &&
      keyboardHeight !== keyboard?.keyboardHeight
    ) {
      setKeyboardHeight(keyboard?.keyboardHeight);
    }
    onKeyboardVisibleChanged(keyboard?.keyboardShown);
  }, [keyboard?.keyboardShown]);

  useEffect(() => {
    DeviceEventEmitter.emit('sticker-board-visible-change', visible);
  }, [visible]);

  const show = () => {
    if (visible) return;

    setVisible(true);

    Keyboard.dismiss();

    height.value = withTiming(keyboardHeight, {
      duration: 200,
    });
  };

  const expand = () => {
    const onDone = () => {
      setIsExpanded(true);
    };

    const expandHeight = keyboard.keyboardShown
      ? calculateContentHeight
      : calculateFullHeight;

    height.value = withTiming(expandHeight, {duration: 200}, () => {
      runOnJS(onDone)();
    });
  };

  const collapse = () => {
    setIsExpanded(false);

    const onDone = () => {
      Keyboard.dismiss();
    };
    height.value = withTiming(
      keyboardHeight + SEARCH_BAR_HEIGHT,
      {
        duration: 200,
      },
      () => {
        runOnJS(onDone)();
      },
    );
  };

  const hide = () => {
    const onHideDone = () => {
      setSearchQuery('');
      setIsExpanded(false);
      setVisible(false);
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

  const onKeyboardVisibleChanged = (keyboardShown: boolean) => {
    if (visible && !keyboardShown) {
      //Wait for keyboard to be invisible
      setTimeout(() => {
        runOnJS(collapse)();
      }, 100);
    } else if (keyboardShown) {
      if (visible) handleUp();
    }
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

  const onChangeText = (value: string) => {
    setLoading(true);
    setSearchQuery(value);
  };

  const onContentUpdate = () => {
    setLoading(false);
  };

  const _onMediaSelect = (
    e: NativeSyntheticEvent<{
      media: GiphyMedia;
    }>,
  ) => {
    onMediaSelect(e.nativeEvent.media);
  };

  if (!visible) return null;

  const bottomPosition = keyboard.keyboardShown
    ? keyboardHeight + SEARCH_BAR_HEIGHT
    : 0;

  return (
    <FlingGestureHandler
      direction={Directions.DOWN}
      // onEnded={handleDown}
      onHandlerStateChange={onDownFlingHandlerStateChange}>
      <Animated.View
        testID="sticker_view"
        style={[
          styles.container,
          animatedStyle,
          isExpanded && {
            ...styles.expanded,
            // height: calculateContentHeight,
            bottom: Platform.OS === 'android' ? 0 : bottomPosition,
          },
        ]}>
        <View style={styles.stickerView}>
          <FlingGestureHandler
            direction={Directions.UP}
            // onEnded={handleUp}
            onHandlerStateChange={onUpFlingHandlerStateChange}>
            <View style={styles.header}>
              <View style={styles.indicator} />
              <SearchInput
                testID="sticker_view.search_input"
                placeholder={i18next.t('post:comment:search_giphy')}
                value={searchQuery}
                onChangeText={onChangeText}
              />
            </View>
          </FlingGestureHandler>
          <View>
            {loading && <LoadingIndicator style={styles.loading} />}
            <GiphyGridView
              testID="sticker_view.grid_view"
              content={request}
              cellPadding={4}
              style={styles.gridView}
              onContentUpdate={onContentUpdate}
              onMediaSelect={_onMediaSelect}
            />
          </View>
        </View>
      </Animated.View>
    </FlingGestureHandler>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    expanded: {
      position: 'absolute',
      left: 0,
      right: 0,
      zIndex: 99,
    },
    header: {
      paddingVertical: spacing.margin.base,
      marginHorizontal: spacing.margin.base,
      height: SEARCH_BAR_HEIGHT,
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
      height: '100%',
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
