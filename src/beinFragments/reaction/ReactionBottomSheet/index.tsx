import React, {FC} from 'react';
import BottomSheet from '~/beinComponents/BottomSheet';
import {IReactionProps} from '~/interfaces/IReaction';
import SelectReactionView from '~/beinFragments/reaction/SelectReactionView';

export interface ReactionBottomSheetProps {
  reactionSheetRef: any;
  autoHide?: boolean;
  onPressReaction?: (reaction: IReactionProps) => void;
}

const ReactionBottomSheet: FC<ReactionBottomSheetProps> = ({
  reactionSheetRef,
  autoHide = true,
  onPressReaction,
}: ReactionBottomSheetProps) => {
  const _onPressReaction = (reaction: IReactionProps) => {
    onPressReaction?.(reaction);
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
