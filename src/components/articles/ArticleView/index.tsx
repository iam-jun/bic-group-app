import { View, StyleSheet } from 'react-native';
import React, { FC, useCallback } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { margin } from '~/theme/spacing';
import Divider from '~/beinComponents/Divider';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import LoadMoreComment from '~/components/LoadMoreComment';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import ArticleItem from '../ArticleItem';
import { spacing } from '~/theme';

export interface ArticleViewProps {
    id: string;
    article: any;
    endCursor: string;
    onPressComment?: () => void;
}

const ArticleView: FC<ArticleViewProps> = ({
  id,
  article,
  endCursor,
  onPressComment,
}) => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);

  const canLoadMoreComment = usePostsStore(useCallback(postsSelector.getCommentOnlyCount(id), []));

  return (
    <>
      <ViewSpacing height={spacing.margin.large} />
      <ArticleItem data={article} onPressComment={onPressComment} />
      <View style={styles.boxDivider}>
        <Divider style={styles.divider} />
      </View>
      {canLoadMoreComment && (
        <LoadMoreComment
          testID="article_view.load_more_comment"
          title="post:text_load_more_comments"
          postId={id}
          endCursor={endCursor}
        />
      )}
    </>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    boxDivider: {
      backgroundColor: colors.white,
    },
    divider: {
      marginHorizontal: margin.large,
    },
  });
};

export default ArticleView;
