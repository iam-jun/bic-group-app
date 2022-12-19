import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import spacing, { margin } from '~/theme/spacing';
import Image from '~/beinComponents/Image';
import images from '~/resources/images';
import { scaleCoverHeight } from '~/theme/dimension';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { PostImportant } from '~/components/posts';
import ArticleHeader from '../ArticleHeader';
import ArticleFooter from '../ArticleFooter';
import { ContentFooterLite, ContentInterestedUserCount } from '~/components/ContentView';
import { Button, PlaceHolderRemoveContent } from '~/baseComponents';
import { IPost } from '~/interfaces/IPost';
import { formatLargeNumber } from '~/utils/formatData';
import { ArticleSummary, ArticleTitle } from '../ArticleText';
import { getTotalReactions } from '~/helpers/post';
import { useRootNavigation } from '~/hooks/navigation';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import TagsView from '~/components/TagsView';
import useCommunitiesStore from '~/store/entities/communities';
import tagsStack from '~/router/navigator/MainStack/stacks/tagsStack/stack';
import { ITag } from '~/interfaces/ITag';

export interface ArticleItemProps {
  data: IPost;
  isLite?: boolean;
}

const ArticleItem: FC<ArticleItemProps> = ({
  data = {},
  isLite,
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
  } = data || {};

  const {
    isImportant, importantExpiredAt,
  } = setting || {};

  const titleArticle = isLite && titleHighlight ? titleHighlight : title;
  const summaryArticle = isLite && summaryHighlight ? summaryHighlight : summary;

  const numberOfReactions = formatLargeNumber(
    getTotalReactions(reactionsCount, 'user'),
  );

  const goToContentDetail = () => rootNavigation.navigate(articleStack.articleContentDetail, { articleId: id });
  const goToDetail = () => rootNavigation.navigate(articleStack.articleDetail, { articleId: id, focusComment: true });
  const goToTagDetail = (tagData: ITag) => {
    const communityId = useCommunitiesStore.getState().currentCommunityId;
    rootNavigation.navigate(tagsStack.tagDetail, { tagData, communityId });
  };

  const renderImportant = () => (
    <PostImportant
      isImportant={!!isImportant}
      expireTime={importantExpiredAt}
      markedReadPost={markedReadPost}
      listCommunity={communities}
    />
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
      source={coverMedia?.url}
      defaultSource={images.img_thumbnail_default}
    />
  );

  const renderPreviewSummary = () => (
    <View style={styles.contentContainer}>
      <ArticleTitle text={titleArticle} />
      {(!!summaryArticle) && (
        <>
          <ViewSpacing height={spacing.margin.small} />
          <ArticleSummary text={summaryArticle} />
        </>
      )}
      {tags.length > 0 && (
        <TagsView data={tags} onPressTag={goToTagDetail} />
      )}
    </View>
  );

  const renderInterestedBy = () => (
    <ContentInterestedUserCount
      id={id}
      testIDPrefix="article_item"
      interestedUserCount={totalUsersSeen}
    />
  );

  const renderFooter = () => (
    <ArticleFooter
      articleId={id}
      canReact={setting?.canReact}
      canComment={setting?.canComment}
      commentsCount={commentsCount}
      reactionsCount={reactionsCount}
      ownerReactions={ownerReactions}
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
        onPressComment={goToDetail}
      />
    </>
  );

  if (reported) {
    return (<PlaceHolderRemoveContent label="common:text_article_reported" />);
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
      {!isLite && renderFooter()}
    </View>
  );
};

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
      width: '100%',
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
  });
};

export default ArticleItem;
