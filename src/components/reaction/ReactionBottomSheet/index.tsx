import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import {
  LayoutRectangle, StyleSheet, TextInput, View,
} from 'react-native';

import { useDispatch } from 'react-redux';
import { useKeyboard } from '@react-native-community/hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useKeySelector } from '~/hooks/selector';
import * as modalActions from '~/storeRedux/modal/actions';
import commonKeySelector from '~/storeRedux/modal/keySelector';
import { margin, padding } from '~/theme/spacing';
import { SearchInput } from '~/baseComponents/Input';
import useEmojiPickerStore from '~/baseComponents/EmojiPicker/store';
import IEmojiPickerState from '~/baseComponents/EmojiPicker/store/Interface';
import EmojiPicker from '~/baseComponents/EmojiPicker';
import BaseBottomSheet from '~/baseComponents/BottomSheet/BaseBottomSheet';

const SNAP_HEIGHT = 400;

const ReactionBottomSheet = () => {
  const reactionSheetRef: any = useRef();
  const searchInputRef = useRef<TextInput>();

  const dispatch = useDispatch();
  const { keyboardShown } = useKeyboard();
  const insets = useSafeAreaInsets();
  const defaultPaddingBottom = insets.bottom + padding.large;
  const showValue = useSharedValue(defaultPaddingBottom);
  const actions = useEmojiPickerStore((state: IEmojiPickerState) => state.actions);

  const [bottomOffset, setBottomOffset] = useState(SNAP_HEIGHT);
  const layoutHeight = useRef(0);

  const data = useKeySelector(commonKeySelector.reactionBottomSheet);
  const { visible, callback } = data || {};

  useEffect(() => {
    if (keyboardShown) hide();
    else show();
  }, [keyboardShown]);

  const bottomViewStyle = useAnimatedStyle(() => ({
    height: showValue.value,
  }));

  const show = () => {
    showValue.value = withTiming(
      defaultPaddingBottom, undefined,
    );
  };

  const hide = () => {
    showValue.value = withTiming(
      0, undefined,
    );
  };

  const _onPressReaction = (key: string) => {
    callback?.(key);
    reactionSheetRef?.current?.close?.();
  };

  const _onClose = () => {
    actions.resetData();
    dispatch(modalActions.setShowReactionBottomSheet());
  };

  const onSearchFocus = () => reactionSheetRef.current?.open('top');

  const onChangeText = (text:string) => {
    actions.search(text);
  };

  const onPositionChange = (position: 'top' | 'initial') => {
    if (position === 'initial') {
      searchInputRef.current?.blur();
      setBottomOffset(layoutHeight.current - SNAP_HEIGHT);
    } else {
      setBottomOffset(0);
    }
  };

  const onLayout = useCallback((nativeEvent: {layout: LayoutRectangle}) => {
    layoutHeight.current = nativeEvent.layout.height;
  }, []);

  return (
    <BaseBottomSheet
      modalizeRef={reactionSheetRef}
      isOpen={visible}
      snapPoint={SNAP_HEIGHT}
      adjustToContentHeight={false}
      closeSnapPointStraightEnabled={false}
      onClose={_onClose}
      onLayout={onLayout}
      childrenStyle={styles.childrenStyle}
      onPositionChange={onPositionChange}
      scrollViewProps={{
        keyboardShouldPersistTaps: 'handled',
        keyboardDismissMode: 'interactive',
        contentContainerStyle: styles.contentContainerStyle,
      }}
      ContentComponent={(
        <View style={styles.container}>
          <SearchInput
            style={styles.searchInput}
            inputRef={searchInputRef}
            onChangeText={onChangeText}
            onFocus={onSearchFocus}
          />
          <EmojiPicker bottomOffset={bottomOffset} onEmojiPress={_onPressReaction} />
          <Animated.View style={bottomViewStyle} />
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    height: '100%',
  },
  childrenStyle: {
    paddingBottom: 0,
  },
  container: {
    flex: 1,
    paddingTop: padding.large,
  },
  searchInput: {
    marginHorizontal: margin.base,
    marginBottom: margin.base,
  },
});

export default ReactionBottomSheet;
