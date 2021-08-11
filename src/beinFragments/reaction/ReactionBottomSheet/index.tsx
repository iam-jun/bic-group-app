import React, {FC} from 'react';
import BottomSheet from '~/beinComponents/BottomSheet';
import {IReactionProps} from '~/interfaces/IReaction';
import SelectReactionView from '~/beinFragments/reaction/SelectReactionView';
import {ReactionType} from '~/constants/reactions';

export interface ReactionBottomSheetProps {
  reactionSheetRef: any;
  autoHide?: boolean;
  onPressReaction?: (reactionId: ReactionType) => void;
}

const ReactionBottomSheet: FC<ReactionBottomSheetProps> = ({
  reactionSheetRef,
  autoHide = true,
  onPressReaction,
}: ReactionBottomSheetProps) => {
  const _onPressReaction = (reaction: IReactionProps) => {
    onPressReaction?.(reaction.id);
    autoHide && reactionSheetRef?.current?.close?.();
  };

  return (
    <BottomSheet
      modalizeRef={reactionSheetRef}
      ContentComponent={
        <SelectReactionView onPressReaction={_onPressReaction} />
      }
    />
  );
};

export default ReactionBottomSheet;
