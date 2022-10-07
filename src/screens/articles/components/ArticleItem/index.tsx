import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import { ExtendedTheme, useTheme } from '@react-navigation/native';

import spacing, { margin } from '~/theme/spacing';
import useArticleStore from '~/store/article';
import { IArticlesState } from '~/store/article/Interface';
import { PostViewFooter } from '~/screens/post/components/PostViewComponents';
import { useBaseHook } from '~/hooks';
import ArticleHeader from '../ArticleHeader';
import Image from '~/beinComponents/Image';
import Text from '~/beinComponents/Text';
import images from '~/resources/images';

export interface ArticleItemProps {
  id: string;
}

const ArticleItem: FC<ArticleItemProps> = ({
  id,
}: ArticleItemProps) => {
  const { t } = useBaseHook();
  // const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const data = useArticleStore((state: IArticlesState) => state.items[id]);
  const {
    title, audience, actor, createdAt, commentCount, reactionsCount, setting, cover, summary,
  } = data || {};
  const labelButtonComment = `${commentCount ? `${commentCount} ` : ''}${t(
    'post:button_comment',
  )}`;

  return (
    <View style={styles.container}>
      <ArticleHeader
        articleId={id}
        actor={actor}
        time={createdAt}
        audience={audience}
      />
      <View style={styles.contentContainer}>
        <Image style={styles.cover} source={cover} defaultSource={images.img_cover_default} />
        <Text.H3
          testID="post_view_content"
          numberOfLines={2}
        >
          {title}
        </Text.H3>
        <Text.SubtitleM>{summary}</Text.SubtitleM>
      </View>
      <PostViewFooter
        labelButtonComment={labelButtonComment}
        reactionCounts={reactionsCount}
        // onAddReaction={onAddReaction}
        // onPressComment={_onPressComment}
        // btnReactTestID={btnReactTestID}
        // btnCommentTestID={btnCommentTestID}
        canComment={setting?.canComment}
        canReact={setting?.canReact}
        // hasReactPermission={hasReactPermission}
      />
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors, elevations } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
      ...elevations.e2,
    },
    cover: {
      width: '100%',
      height: 200,
      marginBottom: margin.base,
    },
    contentContainer: {
      marginVertical: spacing.margin.small,
      marginHorizontal: spacing.margin.large,
    },
    imageLite: {
      width: 120,
      height: 120,
      borderRadius: spacing.borderRadius.small,
    },
  });
};

export default ArticleItem;
