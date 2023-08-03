import React, { FC } from 'react';
import { Omit, StyleSheet, View } from 'react-native';
import ReactionView from '~/beinComponents/ReactionView';
import ContentFooter, { ContentFooterProps } from '~/components/ContentView/ContentFooter';
import { useRootNavigation } from '~/hooks/navigation';
import useContentActions from '~/hooks/useContentActions';
import { PostType, TargetType } from '~/interfaces/IPost';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import { padding } from '~/theme/spacing';
import { ArticleReactionsProps } from '../ArticleReactions';
import { handleLabelButtonComment } from '~/utils/common';
import { TrackingEventContentReadAction, TrackingEventContentReadProperties, TrackingEventType } from '~/interfaces/ITrackingEvent';
import { trackEvent } from '~/services/tracking';

export interface ArticleFooterProps extends Omit<ContentFooterProps, 'labelButtonComment'>, Omit<ArticleReactionsProps, 'onAddReaction'> {
  articleId: string;
  hideReaction?: boolean;
  reactionToDetail?: boolean;
  commentsCount?: number;
}

const ArticleFooter: FC<ArticleFooterProps> = ({
  articleId, hideReaction, reactionToDetail,
  ownerReactions, reactionsCount, commentsCount, onPressComment, ...props
}) => {
  const { rootNavigation } = useRootNavigation();

  const labelButtonComment = handleLabelButtonComment(commentsCount);

  const { onAddReaction, onRemoveReaction, onLongPressReaction } = useContentActions({
    postId: articleId,
    ownerReactions,
    reactionsCount,
    targetType: TargetType.ARTICLE,
  });

  const navigateToDetail = (focusComment?: boolean) => {
    rootNavigation.navigate(articleStack.articleDetail, { articleId, focusComment });
  };

  const _onPressComment = () => {
    if (onPressComment) {
      onPressComment?.(articleId);
    } else {
      navigateToDetail(true);

      // tracking event
      const eventContentReadProperties: TrackingEventContentReadProperties = {
        content_type: PostType.ARTICLE,
        action: TrackingEventContentReadAction.COMMENT,
      };
      trackEvent({ event: TrackingEventType.CONTENT_READ, properties: eventContentReadProperties });
    }
  };

  const onPressReaction = reactionToDetail ? navigateToDetail : undefined;

  return (
    <View testID="article_footer">
      {!hideReaction && (
        <ReactionView
          style={styles.reactions}
          ownerReactions={ownerReactions}
          reactionsCount={reactionsCount}
          onAddReaction={onAddReaction}
          onRemoveReaction={onRemoveReaction}
          onLongPressReaction={onLongPressReaction}
        />
      )}
      <ContentFooter
        {...props}
        btnReactTestID="article_footer.btn_react"
        reactionsCount={reactionsCount}
        labelButtonComment={labelButtonComment}
        onAddReaction={onAddReaction}
        onPressComment={_onPressComment}
        onPressReaction={onPressReaction}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  reactions: {
    paddingHorizontal: padding.base,
  },
});

export default ArticleFooter;
