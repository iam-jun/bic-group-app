import React from 'react';
import { StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import ReactionView from '~/beinComponents/ReactionView';
import { ReactionType } from '~/constants/reactions';
import { IPayloadReactionDetailBottomSheet } from '~/interfaces/IModal';
import { IOwnReaction, IReactionCounts } from '~/interfaces/IPost';
import modalActions from '~/storeRedux/modal/actions';
import { spacing } from '~/theme';

interface Props {
  id: string;
  ownerReactions: IOwnReaction;
  reactionsCount: IReactionCounts;
  onAddReaction?: any;
  onRemoveReaction?: any;
}

const ArticleReactions = ({
  id, ownerReactions, reactionsCount, onAddReaction, onRemoveReaction,
}: Props) => {
  const dispatch = useDispatch();
  const styles = createStyles();

  const _onAddReaction = (_reactionId: ReactionType) => {
    onAddReaction?.(_reactionId);
  };

  const _onRemoveReaction = (_reactionId: ReactionType) => {
    onRemoveReaction?.(_reactionId);
  };

  const onLongPressReaction = (reactionType: ReactionType) => {
    const payload: IPayloadReactionDetailBottomSheet = {
      isOpen: true,
      reactionCounts: reactionsCount,
      initReaction: reactionType,
      getDataParam: { target: 'POST', targetId: id },
    };
    dispatch(modalActions.showReactionDetailBottomSheet(payload));
  };

  return (
    <ReactionView
      hasReactPermission
      style={styles.reactions}
      ownerReactions={ownerReactions}
      reactionsCount={reactionsCount}
      onAddReaction={_onAddReaction}
      onRemoveReaction={_onRemoveReaction}
      onLongPressReaction={onLongPressReaction}
    />
  );
};

const createStyles = () => StyleSheet.create({
  reactions: {
    paddingHorizontal: spacing.padding.base,
  },
});

export default ArticleReactions;
