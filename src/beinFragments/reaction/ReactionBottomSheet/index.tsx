import React, {FC} from 'react';
import {View} from 'react-native';

import BottomSheet from '~/beinComponents/BottomSheet';
import {IReactionProps} from '~/interfaces/IReaction';
import SelectReactionView from '~/beinFragments/reaction/SelectReactionView';
import {ReactionType} from '~/constants/reactions';
import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';

export interface ReactionBottomSheetProps {
  reactionSheetRef: any;
  autoHide?: boolean;
  title?: string;
  onPressReaction?: (reactionId: ReactionType) => void;
}

const ReactionBottomSheet: FC<ReactionBottomSheetProps> = ({
  reactionSheetRef,
  autoHide = true,
  title,
  onPressReaction,
}: ReactionBottomSheetProps) => {
  const theme: ITheme = useTheme() as ITheme;
  const {spacing, colors} = theme;

  const _onPressReaction = (reaction: IReactionProps) => {
    onPressReaction?.(reaction.id);
    autoHide && reactionSheetRef?.current?.close?.();
  };

  return (
    <BottomSheet
      modalizeRef={reactionSheetRef}
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
