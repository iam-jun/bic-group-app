import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import spacing, { margin } from '~/theme/spacing';
import Image from '~/components/Image';
import images from '~/resources/images';
import dimension, { scaleCoverHeight } from '~/theme/dimension';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { ButtonMarkAsRead, PostImportant } from '~/components/posts';
import ArticleHeader from '../ArticleHeader';
import ArticleFooter from '../ArticleFooter';
import ArticleReadingTime from '../ArticleReadingTime';
import {
  ContentFooterLite,
  ContentInterestedUserCount,
} from '~/components/ContentView';
import { Button, PlaceHolderRemoveContent } from '~/baseComponents';
import { IPost } from '~/interfaces/IPost';
import { formatLargeNumber } from '~/utils/formatter';
import { ArticleSummary, ArticleTitle } from '../ArticleText';
import { getTotalReactions } from '~/helpers/post';
import { useRootNavigation } from '~/hooks/navigation';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import TagsView from '~/components/TagsView';
import tagsStack from '~/router/navigator/MainStack/stacks/tagsStack/stack';
import { ITag } from '~/interfaces/ITag';
import Divider from '~/beinComponents/Divider';
import DeletedItem from '~/components/DeletedItem';
import DraftQuizFooter from '~/components/quiz/DraftQuizFooter';
import TakePartInAQuiz from '~/components/quiz/TakePartInAQuiz';

export interface ArticleItemProps {
  data: IPost;
  isLite?: boolean;
  shouldHideBannerImportant?: boolean;
  shouldShowDraftQuiz?: boolean;
  onPressComment?: () => void;
}

const ArticleItem: FC<ArticleItemProps> = ({
  data = {},
  isLite,
  shouldHideBannerImportant,
  shouldShowDraftQuiz = false,
  onPressComment,
}: ArticleItemProps) => {
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);

  const {
    id,
    title,
    audience,
    actor,
    createdAt,
    publishedAt,
    commentsCount,
    reactionsCount,
    setting,
    summary,
    totalUsersSeen,
    ownerReactions,
    titleHighlight,
    summaryHighlight,
    coverMedia,
    markedReadPost,
    communities,
    tags,
    reported,
    deleted = false,
    isHidden,
    wordCount,
    quiz,
    quizHighestScore,
  } = data || {};

  const { isImportant, importantExpiredAt } = setting || {};

  const titleArticle = isLite && titleHighlight ? titleHighlight : title;
  const summaryArticle
    = isLite && summaryHighlight ? summaryHighlight : summary;

  const numberOfReactions = formatLargeNumber(
    getTotalReactions(reactionsCount, 'user'),
  );

  const goToContentDetail = () => rootNavigation.navigate(articleStack.articleContentDetail, {
    articleId: id,
  });
  const goToDetail = () => rootNavigation.navigate(articleStack.articleDetail, {
    articleId: id,
    focusComment: true,
  });
  const goToTagDetail = (tagData: ITag) => {
    rootNavigation.navigate(tagsStack.tagDetail, { tagData });
  };

  const renderImportant = () => (
    <PostImportant
      isImportant={!!isImportant}
      expireTime={importantExpiredAt}
      markedReadPost={markedReadPost}
      listCommunity={communities}
      shouldBeHidden={shouldHideBannerImportant}
    />
  );

  const renderHeader = () => (
    <ArticleHeader
      data={data}
      actor={actor}
      createdAt={createdAt}
      publishedAt={publishedAt}
      audience={audience}
    />
  );

  const renderImageThumbnail = () => (
    <Image
      style={styles.cover}
      source={coverMedia?.url}
      defaultSource={images.img_thumbnail_default}
    />
  );

  const renderPreviewSummary = () => (
    <View style={styles.contentContainer}>
      <ArticleTitle text={titleArticle} />
      {!!summaryArticle && (
        <>
          <ViewSpacing height={spacing.margin.small} />
          <ArticleSummary text={summaryArticle} />
        </>
      )}
      {tags?.length > 0 && <TagsView data={tags} onPressTag={goToTagDetail} />}
    </View>
  );

  const renderInterestedBy = () => !isHidden && (
    <View style={styles.boxInterested}>
      <ArticleReadingTime numberWords={wordCount} />
      <ContentInterestedUserCount
        id={id}
        testIDPrefix="article_item"
        interestedUserCount={totalUsersSeen}
      />
    </View>
  );

  const renderFooter = () => {
    if (shouldShowDraftQuiz || isHidden) return null;

    return (
      <ArticleFooter
        articleId={id}
        canReact={setting?.canReact}
        canComment={setting?.canComment}
        commentsCount={commentsCount}
        reactionsCount={reactionsCount}
        ownerReactions={ownerReactions}
        onPressComment={onPressComment}
      />
    );
  };

  const renderDivider = () => {
    if (isHidden || shouldShowDraftQuiz) return null;

    return <Divider style={styles.divider} />;
  };

  const renderLite = () => (
    <>
      <ViewSpacing height={spacing.margin.large} />
      <ContentFooterLite
        id={id}
        reactionsCount={Number(numberOfReactions)}
        commentsCount={commentsCount}
        totalUsersSeen={totalUsersSeen}
        onPressComment={goToDetail}
      />
    </>
  );

  const renderMarkAsRead = () => {
    if (shouldShowDraftQuiz) return null;

    return (
      <ButtonMarkAsRead
        postId={id}
        markedReadPost={markedReadPost}
        isImportant={isImportant}
        expireTime={importantExpiredAt}
      />
    );
  };

  const renderDraftQuizFooter = () => {
    if (!shouldShowDraftQuiz) return null;

    return (
      <DraftQuizFooter data={data} />
    );
  };

  const renderTakePartInAQuiz = () => (
    <TakePartInAQuiz
      quiz={quiz}
      contentId={id}
      quizHighestScore={quizHighestScore}
      actor={actor}
      shouldShowDraftQuiz={shouldShowDraftQuiz}
    />
  );

  if (deleted) {
    return <DeletedItem title="article:text_delete_article_success" />;
  }

  if (reported) {
    return <PlaceHolderRemoveContent label="common:text_article_reported" />;
  }

  return (
    <View testID="article_item" style={styles.container}>
      {renderImportant()}
      {renderHeader()}
      <Button testID="article_item.btn_content" onPress={goToContentDetail}>
        {renderImageThumbnail()}
        {renderPreviewSummary()}
      </Button>
      {isLite && renderLite()}
      {!isLite && renderInterestedBy()}
      {!isLite && renderTakePartInAQuiz()}
      {!isLite && renderDivider()}
      {!isLite && renderFooter()}
      {!isLite && renderMarkAsRead()}
      {renderDraftQuizFooter()}
    </View>
  );
};

export const COVER_ARTICLE_WIDTH = dimension.deviceWidth;
const coverHeight = scaleCoverHeight();

const themeStyles = (theme: ExtendedTheme) => {
  const { colors, elevations } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
      ...elevations.e2,
    },
    cover: {
      width: COVER_ARTICLE_WIDTH,
      height: coverHeight,
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
    divider: {
      marginTop: spacing.margin.small,
      marginBottom: spacing.margin.small,
      marginHorizontal: spacing.margin.large,
    },
    boxInterested: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  });
};

export default ArticleItem;
