import React, { FC, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useDispatch } from 'react-redux';
import spacing, { margin } from '~/theme/spacing';
import { useBaseHook } from '~/hooks';
import Image from '~/beinComponents/Image';
import images from '~/resources/images';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import { scaleCoverHeight } from '~/theme/dimension';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import ArticleHeader from '../ArticleHeader';
import ArticleFooter from '../ArticleFooter';
import ContentInterestedUserCount from '~/components/ContentView/components/ContentInterestedUserCount';
import ArticleReactions from '../ArticleReactions';
import { ReactionType } from '~/constants/reactions';
import { IPayloadReactToPost } from '~/interfaces/IPost';
import postActions from '~/storeRedux/post/actions';
import useCommonController from '~/screens/store';
import { PostViewFooterLite } from '~/screens/post/components/PostViewComponents';
import { formatLargeNumber } from '~/utils/formatData';
import { getTotalReactions } from '~/screens/post/components/PostViewComponents/helper';
import ArticleText from '../ArticleText';

export interface ArticleItemProps {
  id: string;
  isLite?: boolean;
}

const ArticleItem: FC<ArticleItemProps> = ({
  id,
  isLite,
}: ArticleItemProps) => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const postData = usePostsStore(postsSelector.getPost(id));
  const commonController = useCommonController((state) => state.actions);

  const {
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
  } = postData || {};
  const labelButtonComment = `${commentsCount ? `${commentsCount} ` : ''}${t(
    'post:button_comment',
  )}`;

  const numberOfReactions = formatLargeNumber(
    getTotalReactions(reactionsCount, 'user'),
  );

  const dispatch = useDispatch();

  const onPressMarkSeenPost = useCallback(() => {
    dispatch(postActions.putMarkSeenPost({ postId: id }));
  }, [id]);

  const onAddReaction = (reactionId: ReactionType) => {
    const payload: IPayloadReactToPost = {
      id,
      reactionId,
      ownReaction: ownerReactions,
      reactionCounts: reactionsCount,
    };
    commonController.putReactionToPost(payload);
    onPressMarkSeenPost();
  };

  const onRemoveReaction = (reactionId: ReactionType) => {
    if (id) {
      const payload: IPayloadReactToPost = {
        id,
        reactionId,
        ownReaction: ownerReactions,
        reactionCounts: reactionsCount,
      };
      commonController.deleteReactToPost(payload);
    }
  };

  const renderHeader = () => (
    <ArticleHeader
      articleId={id}
      actor={actor}
      time={createdAt}
      audience={audience}
    />
  );

  const renderImageThumbnail = () => (
    <Image
      style={styles.cover}
      source={images.img_thumbnail_default}
      defaultSource={images.img_thumbnail_default}
    />
  );

  const renderPreviewSummary = () => (
    <View style={styles.contentContainer}>
      <ArticleText type="title" text={titleHighlight || title} />
      {(!!summaryHighlight || !!summary) && (
        <>
          <ViewSpacing height={spacing.margin.small} />
          <ArticleText type="summary" text={summaryHighlight || summary} />
        </>
      )}
    </View>
  );

  const renderInterestedBy = () => (
    <ContentInterestedUserCount id={id} interestedUserCount={totalUsersSeen} />
  );

  const renderReactions = () => (
    <ArticleReactions
      id={id}
      ownerReactions={ownerReactions}
      reactionsCount={reactionsCount}
      onAddReaction={onAddReaction}
      onRemoveReaction={onRemoveReaction}
    />
  );

  const renderFooter = () => (
    <ArticleFooter
      articleId={id}
      labelButtonComment={labelButtonComment}
      reactionCounts={reactionsCount}
      canComment={setting?.canComment}
      canReact={setting?.canReact}
      onAddReaction={onAddReaction}
    />
  );

  const renderLite = () => (
    <>
      <ViewSpacing height={spacing.margin.large} />
      <PostViewFooterLite
        reactionsCount={Number(numberOfReactions)}
        commentsCount={commentsCount}
        seenCountsViewComponent={(
          <ContentInterestedUserCount
            id={id}
            interestedUserCount={totalUsersSeen}
            isLite
            style={styles.interestedView}
          />
      )}
      />
    </>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      {/* TODO: Updated cover source once API is ready */}
      {renderImageThumbnail()}
      {renderPreviewSummary()}
      {isLite && renderLite()}
      {!isLite && renderInterestedBy()}
      {!isLite && renderReactions()}
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
