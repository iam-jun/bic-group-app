import React, { useEffect, useRef, useState } from 'react';
import { LayoutRectangle, View } from 'react-native';

import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useKeyboard } from '@react-native-community/hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Modalize } from 'react-native-modalize';
import SelectReactionView from '~/components/reaction/SelectReactionView';
import Text from '~/beinComponents/Text';

import { useKeySelector } from '~/hooks/selector';
import * as modalActions from '~/storeRedux/modal/actions';
import commonKeySelector from '~/storeRedux/modal/keySelector';
import spacing, { padding } from '~/theme/spacing';
import { SearchInput } from '~/baseComponents/Input';

const SNAP_HEIGHT = 400;

const ReactionBottomSheet = () => {
  const reactionSheetRef: any = useRef();

  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const { keyboardShown } = useKeyboard();
  const [bottomOffset, setBottomOffset] = useState(SNAP_HEIGHT);
  const layoutHeight = useRef(0);
  const insets = useSafeAreaInsets();
  const defaultPaddingBottom = insets.bottom || padding.large;
  const showValue = useSharedValue(defaultPaddingBottom);

  const data = useKeySelector(commonKeySelector.reactionBottomSheet);
  const {
    title, visible, callback,
  } = data || {};

  useEffect(() => {
    reactionSheetRef?.current?.open?.();
  }, [visible]);

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
    dispatch(modalActions.setShowReactionBottomSheet());
  };

  const onSearchFocus = () => reactionSheetRef.current?.open('top');

  return (
    <Modalize
      ref={reactionSheetRef}
      // isOpen={visible}
      snapPoint={SNAP_HEIGHT}
      adjustToContentHeight={false}
      closeSnapPointStraightEnabled={false}
      handlePosition="inside"
      onClose={_onClose}
      onLayout={(nativeEvent: {
        layout: LayoutRectangle
      }) => {
        console.log('onLayout', nativeEvent.layout);
        layoutHeight.current = nativeEvent.layout.height;
      }}
      onPositionChange={(position) => {
        setBottomOffset(position === 'initial' ? layoutHeight.current - SNAP_HEIGHT : 0);
      }}
      childrenStyle={{ paddingBottom: 0 }}
      scrollViewProps={{
        keyboardShouldPersistTaps: 'handled',
        keyboardDismissMode: 'interactive',

        contentContainerStyle: {
          height: bottomOffset > 0 ? SNAP_HEIGHT : '100%',
        },
      }}
      // ContentComponent={(
      //   <View
      //     style={{ flex: 1 }}
      //     // onLayout={(event: LayoutChangeEvent) => {
      //     //   console.log('onLayout', event.nativeEvent.layout);
      //     // }}
      //   >
      //     {!!title && (
      //       <Text.H6
      //         style={{
      //           paddingHorizontal: spacing.padding.large,
      //           paddingTop: spacing.padding.small,
      //         }}
      //         color={colors.gray50}
      //       >
      //         {title}
      //       </Text.H6>
      //     )}
      //     <SelectReactionView bottomOffset={bottomOffset} onPressReaction={_onPressReaction} />
      //     <Animated.View style={bottomViewStyle} />
      //   </View>
      // )}
    >
      <View
        style={{ flex: 1 }}
      >
        {!!title && (
        <Text.H6
          style={{
            paddingHorizontal: spacing.padding.large,
            paddingTop: spacing.padding.small,
          }}
          color={colors.gray50}
        >
          {title}
        </Text.H6>
        )}
        <SearchInput onFocus={onSearchFocus} />
        <SelectReactionView bottomOffset={0} onPressReaction={_onPressReaction} />
        <Animated.View style={bottomViewStyle} />
      </View>
    </Modalize>
  );
};

export default ReactionBottomSheet;
