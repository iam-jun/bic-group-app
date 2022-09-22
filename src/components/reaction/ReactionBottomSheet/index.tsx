import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';

import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useKeyboard } from '@react-native-community/hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import BottomSheet from '~/baseComponents/BottomSheet';
import SelectReactionView from '~/components/reaction/SelectReactionView';
import Text from '~/beinComponents/Text';

import { useKeySelector } from '~/hooks/selector';
import * as modalActions from '~/storeRedux/modal/actions';
import commonKeySelector from '~/storeRedux/modal/keySelector';
import spacing, { padding } from '~/theme/spacing';

const ReactionBottomSheet = () => {
  const reactionSheetRef: any = useRef();

  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const { keyboardShown } = useKeyboard();
  const insets = useSafeAreaInsets();
  const defaultPaddingBottom = insets.bottom || padding.large;
  const showValue = useSharedValue(defaultPaddingBottom);

  useEffect(() => {
    if (keyboardShown) hide();
    else show();
  }, [keyboardShown]);

  const data = useKeySelector(commonKeySelector.reactionBottomSheet);
  const {
    title, visible, callback,
  } = data || {};

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

  return (
    <BottomSheet
      modalizeRef={reactionSheetRef}
      isOpen={visible}
      // snapPoint={500}
      closeSnapPointStraightEnabled={false}
      onClose={_onClose}
      childrenStyle={{ paddingBottom: 0 }}
      scrollViewProps={{
        keyboardShouldPersistTaps: 'handled',
        keyboardDismissMode: 'interactive',
        contentContainerStyle: {
          height: '100%',
        },
      }}
      ContentComponent={(
        <View style={{ flex: 1 }}>
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
          <SelectReactionView onPressReaction={_onPressReaction} />
          <Animated.View style={bottomViewStyle} />
        </View>
      )}
    />
  );
};

export default ReactionBottomSheet;
