import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import ReactionView from '~/beinComponents/ReactionView';
import { IOwnReaction, IReactionCounts } from '~/interfaces/IPost';
import { spacing } from '~/theme';

export interface ArticleReactionsProps {
  ownerReactions: IOwnReaction;
  reactionsCount: IReactionCounts;

  onAddReaction?: (key: string) => void;
  onRemoveReaction?: (key: string) => void;
  onLongPressReaction?: (key: string) => void;
}

const ArticleReactions: FC<ArticleReactionsProps> = ({
  ownerReactions, reactionsCount,
  onAddReaction, onRemoveReaction, onLongPressReaction,
}) => {
  const styles = createStyles();

  return (
    <ReactionView
      hasReactPermission
      style={styles.reactions}
      ownerReactions={ownerReactions}
      reactionsCount={reactionsCount}
      onAddReaction={onAddReaction}
      onRemoveReaction={onRemoveReaction}
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
