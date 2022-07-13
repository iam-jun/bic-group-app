import {GiphyContent, GiphyGridView, GiphyMedia} from '@giphy/react-native-sdk';
import {useKeyboard} from '@react-native-community/hooks';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import i18next from 'i18next';
import {debounce} from 'lodash';
import React, {useEffect, useImperativeHandle, useRef} from 'react';
import {Keyboard, NativeSyntheticEvent, StyleSheet, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {AppConfig} from '~/configs';
import {dimension} from '~/theme';
import spacing from '~/theme/spacing';
import {EmojiBoardProps} from '../emoji/EmojiBoard';
import SearchInput from '../inputs/SearchInput';
import LoadingIndicator from '../LoadingIndicator';

export interface Props extends Partial<EmojiBoardProps> {
  stickerViewRef: any;
  onMediaSelect: (media: GiphyMedia) => void;
}

const _StickerView = ({stickerViewRef, onMediaSelect}: Props) => {
  const INITIAL_KEYBOARD_HEIGHT = 336;
  const modalizeRef = useRef<Modalize>();

  const [keyboardHeight, setKeyboardHeight] = React.useState(
    INITIAL_KEYBOARD_HEIGHT,
  );
  const [searchQuery, setSearchQuery] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [modalTopOffset, setModalTopOffset] = React.useState(0);
  const _stickerViewRef = stickerViewRef || useRef();

  const request = searchQuery
    ? GiphyContent.search({searchQuery: searchQuery})
    : GiphyContent.trending({mediaType: undefined});

  const height = useSharedValue(0);

  const theme = useTheme() as ExtendedTheme;
  const styles = createStyle(theme);

  const keyboard = useKeyboard();
  useEffect(() => {
    if (
      keyboard?.keyboardHeight &&
      keyboardHeight !== keyboard?.keyboardHeight
    ) {
      setKeyboardHeight(keyboard?.keyboardHeight);
    }
  }, [keyboard?.keyboardHeight]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });

  const show = () => {
    modalizeRef.current?.open('default');
    Keyboard.dismiss();
  };

  const hide = () => {
    modalizeRef.current?.close();
  };

  const onChangeText = debounce((value: string) => {
    setLoading(true);
    setSearchQuery(value);
  }, AppConfig.searchTriggerTime);

  // When content is updated, it means request has been done
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

  // Only trigger when opend, closed event is not triggered
  const onPositionChange = (position: 'top' | 'initial') => {
    setModalTopOffset(position === 'top' ? dimension.headerHeight : 0);
  };

  const onOpen = () => {
    setTimeout(() => {
      height.value = withTiming(keyboardHeight, {duration: 400});
    }, 200);
  };

  const onClose = () => {
    // reset position
    onPositionChange('initial');

    height.value = withTiming(0, {duration: 200});
  };

  const onSearchFocus = () => {
    // trigger before modal reach the top to make app looks smooth
    onPositionChange('top');
    modalizeRef.current?.open('top');
  };

  const onBackPress = () => {
    hide();
    return true;
  };

  useImperativeHandle(_stickerViewRef, () => ({
    show,
    hide,
    onBackPress: hide,
  }));

  return (
    <View testID="sticker_view" style={styles.container}>
      <Animated.View style={animatedStyle} />
      {/* <Portal> */}
      <Modalize
        ref={modalizeRef}
        withOverlay={modalTopOffset !== 0}
        handlePosition="inside"
        snapPoint={keyboardHeight}
        closeSnapPointStraightEnabled={false}
        // alwaysOpen={keyboardHeight}
        modalTopOffset={modalTopOffset}
        // keyboardAvoidingBehavior={'position'}
        // avoidKeyboardLikeIOS
        scrollViewProps={{
          keyboardShouldPersistTaps: 'handled',
          keyboardDismissMode: 'interactive',
          contentContainerStyle: {
            height: '100%',
          },
        }}
        onOpen={onOpen}
        onClose={onClose}
        onBackButtonPress={onBackPress}
        onPositionChange={onPositionChange}>
        <View style={[styles.stickerView]}>
          <View style={styles.header}>
            <SearchInput
              testID="sticker_view.search_input"
              placeholder={i18next.t('post:comment:search_giphy')}
              value={searchQuery}
              onFocus={onSearchFocus}
              onChangeText={onChangeText}
            />
          </View>
          <View>
            {loading && <LoadingIndicator style={styles.loading} />}
            <GiphyGridView
              testID="sticker_view.grid_view"
              content={request}
              cellPadding={4}
              //Must render GiphyGridView to trigger onContentUpdate but make it invisible
              style={[styles.gridView, loading && {height: 0}]}
              onContentUpdate={onContentUpdate}
              onMediaSelect={_onMediaSelect}
            />
          </View>
        </View>
      </Modalize>
      {/* </Portal> */}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const {colors} = theme;

  return StyleSheet.create({
    container: {
      backgroundColor: colors.white,
    },
    stickerView: {
      marginTop: spacing.margin.small,
      height: '100%',
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
