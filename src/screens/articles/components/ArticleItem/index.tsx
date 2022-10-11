import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import spacing, { margin } from '~/theme/spacing';
import useArticlesStore, { IArticlesState } from '~/store/entities/articles';
import { useBaseHook } from '~/hooks';
import Text from '~/beinComponents/Text';
import Image from '~/beinComponents/Image';
import images from '~/resources/images';
import { scaleCoverHeight } from '~/theme/dimension';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import ArticleHeader from '../ArticleHeader';
import ArticleFooter from '../ArticleFooter';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import ContentInterestedUserCount from '~/components/ContentView/components/ContentInterestedUserCount';
import ArticleReactions from '../ArticleReactions';

export interface ArticleItemProps {
  id: string;
}

const ArticleItem: FC<ArticleItemProps> = ({
  id,
}: ArticleItemProps) => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const { colors } = theme;
  let data = useArticlesStore((state: IArticlesState) => state.items[id]);
  const postData = usePostsStore(postsSelector.getPost(id));
  if (!data) data = postData;

  const {
    title, audience, actor, createdAt, commentCount, reactionsCount, setting, summary,
    totalUsersSeen, ownerReactions,
  } = data || {};
  const labelButtonComment = `${commentCount ? `${commentCount} ` : ''}${t(
    'post:button_comment',
  )}`;

  const renderHeader = () => (
    <ArticleHeader
      articleId={id}
      actor={actor}
      time={createdAt}
      audience={audience}
    />
  );

  const renderImageThumbnail = () => (
    <Image style={styles.cover} source={images.img_thumbnail_default} defaultSource={images.img_thumbnail_default} />
  );

  const renderPreviewSummary = () => (
    <View style={styles.contentContainer}>
      <Text.H3
        testID="article_item.title"
        color={colors.neutral80}
      >
        {title}
      </Text.H3>
      {!!summary && (
        <>
          <ViewSpacing height={spacing.margin.small} />
          <Text.ParagraphM color={colors.neutral80}>{summary}</Text.ParagraphM>
        </>
      )}
    </View>
  );

  const renderInterestedBy = () => (
    <ContentInterestedUserCount
      id={id}
      interestedUserCount={totalUsersSeen}
    />
  );

  const renderReactions = () => (
    <ArticleReactions
      id={id}
      ownerReactions={ownerReactions}
      reactionsCount={reactionsCount}
    />
  );

  const renderFooter = () => (
    <ArticleFooter
      articleId={id}
      labelButtonComment={labelButtonComment}
      reactionCounts={reactionsCount}
      canComment={setting?.canComment}
      canReact={setting?.canReact}
    />
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      {/* TODO: Updated cover source once API is ready */}
      {renderImageThumbnail()}
      {renderPreviewSummary()}
      {renderInterestedBy()}
      {renderReactions()}
      {renderFooter()}
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
      height: scaleCoverHeight(),
      marginTop: margin.base,
    },
    contentContainer: {
      paddingVertical: spacing.padding.small,
      paddingHorizontal: spacing.padding.large,
      backgroundColor: colors.purple2,
    },
  });
};

export default ArticleItem;
