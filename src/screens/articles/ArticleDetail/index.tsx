import React, {
  FC, memo, useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import {
  RefreshControl, FlatList, StyleSheet, View,
} from 'react-native';

import { ExtendedTheme, useTheme, useIsFocused } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import { IAudienceGroup, PostType } from '~/interfaces/IPost';

import Header from '~/beinComponents/Header';
import CommentItem from '~/beinComponents/list/items/CommentItem';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import { ArticlePlaceholder, ArticleView } from '~/components/articles';
import CommentInputView from '~/screens/comments/components/CommentInputView';
import useMounted from '~/hooks/mounted';
import { IRouteParams } from '~/interfaces/IRouter';
import useArticlesStore, { IArticlesState } from './store';
import useCommentsStore from '~/store/entities/comments';
import commentsSelector from '~/store/entities/comments/selectors';
import usePostsStore, { IPostsState } from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import spacing from '~/theme/spacing';
import usePostDetailContentHandler from '~/screens/post/PostDetail/components/PostDetailContent/hooks/usePostDetailContentHandler';
import { useRootNavigation } from '~/hooks/navigation';
import ContentUnavailable from '~/components/ContentUnavailable';
import BannerReport from '~/components/Report/BannerReport';
import APIErrorCode from '~/constants/apiErrorCode';
import ContentNoPermission from '~/components/ContentNoPermission';
import LoadMoreComment from '~/components/LoadMoreComment';
import { isFromNotificationScreen } from '~/router/helper';
import { trackEvent } from '~/services/tracking';
import { TrackingEventContentReadProperties } from '~/services/tracking/Interface';
import { TrackingEventContentReadAction, TrackingEvent } from '~/services/tracking/constants';

const _ArticleDetail: FC<IRouteParams> = (props) => {
  const navigation = props?.navigation;
  const { params } = props.route;
  const { articleId: id, commentId } = params || {};

  const focusComment = params?.focusComment;
  const isFocused = useIsFocused();
  const { rootNavigation, goHome } = useRootNavigation();

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = themeStyles(theme);

  const listRef = useRef<any>();
  const commentInputRef = useRef<any>();

  const [refreshing, setRefreshing] = useState(false);
  const data = usePostsStore(useCallback(postsSelector.getPost(id, {}), [id]));
  const commentEndCursor = usePostsStore(useCallback(postsSelector.getCommentEndCursor(id), [id]));
  const commentStartCursor = usePostsStore(useCallback(postsSelector.getCommentStartCursor(id), [id]));
  const commentHasPreviousPage = usePostsStore(useCallback(postsSelector.getCommentHasPreviousPage(id), [id]));
  const errorContent = usePostsStore(useCallback(postsSelector.getErrorContent(id), [id]));

  const { reset: resetCommentsStore } = useCommentsStore((state) => state);
  const { clearComments } = usePostsStore((state: IPostsState) => state.actions);

  const comments = useCommentsStore(useCallback(commentsSelector.getCommentsByParentId(id), [id]));

  const { actions } = useArticlesStore((state: IArticlesState) => state);
  const { putMarkSeenPost } = usePostsStore((state: IPostsState) => state.actions);
  const { isError, code } = errorContent || {};

  const {
    audience, setting, reported, deleted,
  } = data || {};

  const {
    onPressComment,
    onScrollToIndexFailed,
    onPressReplySectionHeader,
    onPressLoadMoreCommentLevel2,
  } = usePostDetailContentHandler({
    postId: id, comments, focusComment, listRef, commentInputRef, commentId,
  });

  const groupIds = useMemo(() => {
    if (isEmpty(audience?.groups)) return '';

    const ids = audience.groups.map((g: IAudienceGroup) => g?.id);
    return ids?.join?.(',');
  }, [data.audience]);

  const isMounted = useMounted();

  useEffect(() => {
    if (isMounted) { actions.getArticleDetail({ articleId: id }); }
  }, [isMounted]);

  useEffect(() => {
    if (reported && isFocused) {
      setTimeout(() => {
        rootNavigation.goBack();
      }, 200);
    }
  }, [reported, isFocused]);

  useEffect(() => {
    if (deleted && isFocused) {
      goHome();
    }
  }, [deleted, isFocused]);

  useEffect(() => () => {
    resetCommentsStore();
    clearComments(id);
  }, []);

  useEffect(() => {
    if (navigation) {
      if (isFromNotificationScreen(navigation)) {
        // tracking event
        const eventContentReadProperties: TrackingEventContentReadProperties = {
          content_type: PostType.ARTICLE,
          action: TrackingEventContentReadAction.NOTIFICATION,
        };
        trackEvent({ event: TrackingEvent.CONTENT_READ, properties: eventContentReadProperties });
      }
    }
  }, []);

  const onRefresh = () => {
    setRefreshing(false);
    actions.getArticleDetail({ articleId: id });
  };

  const onPressMarkSeenPost = useCallback(() => {
    putMarkSeenPost({ postId: id });
  }, [id]);

  const renderSectionHeader = (comment: any) => {
    const { item, index } = comment || {};

    return (
      <CommentItem
        postId={id}
        index={index}
        groupIds={groupIds}
        audience={audience}
        isReplyingComment={false}
        showLoadMore={false}
        commentData={item}
        onPressReply={onPressReplySectionHeader}
        onPressLoadMore={onPressLoadMoreCommentLevel2}
        onPressMarkSeenPost={onPressMarkSeenPost}
      />
    );
  };

  const viewMore = commentHasPreviousPage;
  const renderFooter = () => {
    if (!setting?.canComment || comments?.length === 0) {
      return <View style={styles.footer} />;
    } if (viewMore) {
      return <LoadMoreComment title="post:text_load_more_replies" postId={id} startCursor={commentStartCursor} />;
    }
    return null;
  };

  const renderLoading = () => (
    <View testID="article_detail.placeholder" style={styles.loadingContainer}>
      <Header
        title="article:title:detail"
        titleTextProps={{ useI18n: true }}
      />
      <ArticlePlaceholder disableRandom />
    </View>
  );

  const ListHeaderComponent = (
    <ArticleView
      id={id}
      article={data}
      endCursor={commentEndCursor}
      onPressComment={onPressComment}
    />
  );

  const RefrestControl = (
    <RefreshControl
      testID="article_detail.refresh_control"
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={theme.colors.gray40}
    />
  );

  const renderCommentInput = () => {
    if (!setting?.canComment) return null;

    return (
      <CommentInputView
        commentInputRef={commentInputRef}
        postId={id}
        groupIds={groupIds}
        viewMore={viewMore}
      />
    );
  };

  if (!isMounted || !data || (isEmpty(data) && !isError)) return renderLoading();

  if (isError && (
    code === APIErrorCode.Post.CONTENT_GROUP_REQUIRED
    || code === APIErrorCode.Post.ARTICLE_NO_READ_PERMISSION
  )) {
    return <ContentNoPermission data={errorContent} />;
  }

  if (isError && (
    code !== APIErrorCode.Post.CONTENT_GROUP_REQUIRED
    || code !== APIErrorCode.Post.ARTICLE_NO_READ_PERMISSION
  )) {
    return <ContentUnavailable />;
  }

  const keyExtractor = (item: any) => `article_comment_${item?.id || ''}`;

  return (
    <ScreenWrapper
      testID="article_detail"
      backgroundColor={colors.neutral5}
      isFullView
    >
      <Header />
      <BannerReport postId={id} />
      <View style={styles.contentContainer}>
        <FlatList
          ref={listRef}
          data={comments}
          renderItem={renderSectionHeader}
          ListHeaderComponent={ListHeaderComponent}
          ListFooterComponent={renderFooter}
          keyboardShouldPersistTaps="handled"
          keyExtractor={keyExtractor}
          onScrollToIndexFailed={onScrollToIndexFailed}
          scrollEventThrottle={16}
          refreshControl={RefrestControl}
        />
      </View>
      {renderCommentInput()}
    </ScreenWrapper>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    contentContainer: {
      flex: 1,
    },
    loadingContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.neutral5,
      zIndex: 99,
    },
    footer: {
      height: spacing.margin.base,
      backgroundColor: colors.white,
    },
  });
};

const ArticleDetail = memo(_ArticleDetail);
ArticleDetail.whyDidYouRender = true;
export default ArticleDetail;
