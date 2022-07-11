import React, {useRef} from 'react';
import {View} from 'react-native';

import BottomSheet from '~/beinComponents/BottomSheet';
import {IReactionProps} from '~/interfaces/IReaction';
import SelectReactionView from '~/beinFragments/reaction/SelectReactionView';
import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import {useKeySelector} from '~/hooks/selector';
import {useDispatch} from 'react-redux';
import * as modalActions from '~/store/modal/actions';
import commonKeySelector from '~/store/modal/keySelector';
import spacing from '~/theme/spacing';

const ReactionBottomSheet = () => {
  const reactionSheetRef: any = useRef();

  const dispatch = useDispatch();
  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme;

  const data = useKeySelector(commonKeySelector.reactionBottomSheet);
  const {title, show, position, callback, side} = data || {};

  const _onPressReaction = (reaction: IReactionProps) => {
    callback?.(reaction.id);
    reactionSheetRef?.current?.close?.();
  };

  const _onClose = () => {
    dispatch(modalActions.setShowReactionBottomSheet());
  };

  return (
    <BottomSheet
      modalizeRef={reactionSheetRef}
      isOpen={show}
      position={position}
      side={side || 'center'}
      menuMinWidth={375}
      onClose={_onClose}
      ContentComponent={
        <View>
          {!!title && (
            <Text.H6
              style={{
                paddingHorizontal: spacing.padding.large,
                paddingTop: spacing.padding.small,
              }}
              color={colors.textSecondary}>
              {title}
            </Text.H6>
          )}
          <SelectReactionView onPressReaction={_onPressReaction} />
        </View>
      }
    />
  );
};

export default ReactionBottomSheet;
