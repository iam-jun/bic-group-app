import { View, StyleSheet } from 'react-native';
import React, { FC, useCallback } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { margin } from '~/theme/spacing';
import Divider from '~/beinComponents/Divider';
import LoadMoreComment from '~/components/LoadMoreComment';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import ArticleItem from '../ArticleItem';

export interface ArticleViewProps {
    id: string;
    article: any;
    firstCommentId: string;
}

const ArticleView: FC<ArticleViewProps> = ({
  id,
  article,
  firstCommentId,
}) => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);

  const canLoadMoreComment = usePostsStore(useCallback(postsSelector.getCommentOnlyCount(id), []));

  return (
    <View style={styles.container}>
      <ArticleItem data={article} />
      <Divider style={styles.divider} />
      {canLoadMoreComment && (
        <LoadMoreComment
          title="post:text_load_more_comments"
          postId={id}
          idLessThan={firstCommentId}
        />
      )}
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      backgroundColor: colors.neutral,
    },
    body: {
      marginVertical: margin.small,
    },
    title: {
      marginVertical: margin.base,
      marginHorizontal: margin.large,
    },
    footer: {
      height: margin.base,
      backgroundColor: colors.white,
    },
    divider: {
      marginHorizontal: margin.large,
    },
  });
};

export default ArticleView;
