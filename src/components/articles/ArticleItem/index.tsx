import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import spacing, { margin } from '~/theme/spacing';
import { useBaseHook } from '~/hooks';
import Image from '~/beinComponents/Image';
import images from '~/resources/images';
import { scaleCoverHeight } from '~/theme/dimension';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import ArticleHeader from '../ArticleHeader';
import ArticleFooter from '../ArticleFooter';
import { ContentFooterLite, ContentInterestedUserCount } from '~/components/ContentView';
import { IPost } from '~/interfaces/IPost';
import { formatLargeNumber } from '~/utils/formatData';
import { ArticleSummary, ArticleTitle } from '../ArticleText';
import { getTotalReactions } from '~/helpers/post';

export interface ArticleItemProps {
  data: IPost;
  isLite?: boolean;
}

const ArticleItem: FC<ArticleItemProps> = ({
  data,
  isLite,
}: ArticleItemProps) => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);

  const {
    id,
    title,
    audience,
    actor,
    createdAt,
    commentsCount,
    reactionsCount,
    setting,
    summary,
    totalUsersSeen,
    ownerReactions,
    titleHighlight,
    summaryHighlight,
    coverMedia,
  } = data || {};
  const labelButtonComment = `${commentsCount ? `${commentsCount} ` : ''}${t(
    'post:button_comment',
  )}`;

  const numberOfReactions = formatLargeNumber(
    getTotalReactions(reactionsCount, 'user'),
  );

  const renderHeader = () => (
    <ArticleHeader
      data={data}
      actor={actor}
      createdAt={createdAt}
      audience={audience}
    />
  );

  const renderImageThumbnail = () => (
    <Image
      style={styles.cover}
      source={coverMedia?.url || images.img_thumbnail_default}
      defaultSource={images.img_thumbnail_default}
    />
  );

  const renderPreviewSummary = () => (
    <View style={styles.contentContainer}>
      <ArticleTitle text={titleHighlight || title} />
      {(!!summaryHighlight || !!summary) && (
        <>
          <ViewSpacing height={spacing.margin.small} />
          <ArticleSummary text={summaryHighlight || summary} />
        </>
      )}
    </View>
  );

  const renderInterestedBy = () => (
    <ContentInterestedUserCount id={id} interestedUserCount={totalUsersSeen} />
  );

  const renderFooter = () => (
    <ArticleFooter
      articleId={id}
      canReact={setting?.canReact}
      canComment={setting?.canComment}
      reactionsCount={reactionsCount}
      ownerReactions={ownerReactions}
      labelButtonComment={labelButtonComment}
    />
  );

  const renderLite = () => (
    <>
      <ViewSpacing height={spacing.margin.large} />
      <ContentFooterLite
        id={id}
        reactionsCount={Number(numberOfReactions)}
        commentsCount={commentsCount}
        totalUsersSeen={totalUsersSeen}
      />
    </>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderImageThumbnail()}
      {renderPreviewSummary()}
      {isLite && renderLite()}
      {!isLite && renderInterestedBy()}
      {!isLite && renderFooter()}
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
    interestedView: {
      paddingHorizontal: 0,
      paddingBottom: 0,
      paddingTop: 0,
    },
  });
};

export default ArticleItem;
