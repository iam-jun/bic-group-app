import React, { useRef } from 'react';
import { View } from 'react-native';

import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import BottomSheet from '~/baseComponents/BottomSheet';
import SelectReactionView from '~/components/reaction/SelectReactionView';
import Text from '~/beinComponents/Text';

import { useKeySelector } from '~/hooks/selector';
import * as modalActions from '~/storeRedux/modal/actions';
import commonKeySelector from '~/storeRedux/modal/keySelector';
import spacing from '~/theme/spacing';

const ReactionBottomSheet = () => {
  const reactionSheetRef: any = useRef();

  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  const data = useKeySelector(commonKeySelector.reactionBottomSheet);
  const {
    title, visible, callback,
  } = data || {};

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
      onClose={_onClose}
      ContentComponent={(
        <View>
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
        </View>
      )}
    />
  );
};

export default ReactionBottomSheet;
