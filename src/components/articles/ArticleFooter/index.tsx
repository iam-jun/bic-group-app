import React, { FC } from 'react';
import { Omit, StyleSheet, View } from 'react-native';
import ReactionView from '~/beinComponents/ReactionView';
import ContentFooter, { ContentFooterProps } from '~/components/ContentView/ContentFooter';
import { useRootNavigation } from '~/hooks/navigation';
import useContentActions from '~/hooks/useContentActions';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import { padding } from '~/theme/spacing';
import { ArticleReactionsProps } from '../ArticleReactions';

export interface ArticleFooterProps extends ContentFooterProps, Omit<ArticleReactionsProps, 'onAddReaction'> {
  articleId: string;
}

const ArticleFooter: FC<ArticleFooterProps> = ({
  articleId, ownerReactions, reactionsCount, onPressComment, ...props
}) => {
  const { rootNavigation } = useRootNavigation();

  const {
    onAddReaction,
    onRemoveReaction,
    onLongPressReaction,
  } = useContentActions({ postId: articleId, ownerReactions, reactionsCount });

  const _onPressComment = () => {
    if (onPressComment) {
      onPressComment?.(articleId);
    } else {
      rootNavigation.navigate(articleStack.articleDetail, { articleId, focusComment: true });
    }
  };

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
        {...props}
        reactionsCount={reactionsCount}
        onAddReaction={onAddReaction}
        onPressComment={_onPressComment}
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
