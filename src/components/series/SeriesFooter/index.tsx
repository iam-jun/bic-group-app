import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';

import ReactionView from '~/beinComponents/ReactionView';
import ContentFooter from '~/components/ContentView/ContentFooter';
import { IPost } from '~/interfaces/IPost';
import useContentActions from '~/hooks/useContentActions';
import { padding } from '~/theme/spacing';
import { handleLabelButtonComment } from '~/utils/common';

interface SeriesFooterProps {
    series: IPost;
}

const SeriesFooter: FC<SeriesFooterProps> = ({ series }) => {
  const {
    id,
    ownerReactions,
    reactionsCount,
    commentsCount,
    setting,
  } = series || {};

  const {
    onAddReaction,
    onRemoveReaction,
    onLongPressReaction,
  } = useContentActions({ postId: id, ownerReactions, reactionsCount });

  const labelButtonComment = handleLabelButtonComment(commentsCount);

  return (
    <View>
      <ReactionView
        style={styles.reactions}
        ownerReactions={ownerReactions}
        reactionsCount={reactionsCount}
        onAddReaction={onAddReaction}
        onRemoveReaction={onRemoveReaction}
        onLongPressReaction={onLongPressReaction}
      />
      <ContentFooter
        canReact={setting?.canReact}
        canComment={setting?.canComment}
        reactionsCount={reactionsCount}
        onAddReaction={onAddReaction}
        labelButtonComment={labelButtonComment}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  reactions: {
    paddingHorizontal: padding.base,
  },
});

export default SeriesFooter;
