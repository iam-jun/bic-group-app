import React, {
  FC, memo, useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import {
  RefreshControl, SectionList, StyleSheet, View,
} from 'react-native';

import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';
import { useRootNavigation } from '~/hooks/navigation';
import { IAudienceGroup, IMentionUser, IPayloadReactToPost } from '~/interfaces/IPost';
import mainStack from '~/router/navigator/MainStack/stack';

import spacing from '~/theme/spacing';
import useArticlesStore, { IArticlesState } from '~/screens/articles/ArticleDetail/store';
import Header from '~/beinComponents/Header';
import { IRouteParams } from '~/interfaces/IRouter';
import useMounted from '~/hooks/mounted';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import CommentInputView from '~/screens/post/components/CommentInputView';
import useCommentsStore from '~/store/entities/comments';
import commentsSelector from '~/store/entities/comments/selectors';
import CommentItem from '~/beinComponents/list/items/CommentItem';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import postActions from '~/storeRedux/post/actions';
import { ReactionType } from '~/constants/reactions';
import useCommonController from '~/screens/store';
import ArticlePlaceholder from '../components/ArticleWebview/components/ArticlePlaceholder';
import ArticleView from '../components/ArticleView';
import { getSectionData } from '../helper';

const _ArticleDetail: FC<IRouteParams> = (props) => {
  const { params } = props.route;
  const id = params?.articleId;
  const focusComment = params?.focusComment;

  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const dispatch = useDispatch();

  const listRef = useRef<any>();
  const commentInputRef = useRef<any>();
  const layoutSet = useRef(false);
  let countRetryScrollToBottom = useRef(0).current;

  const [refreshing, setRefreshing] = useState(false);
  const [isLoaded, setLoaded] = useState(false);
  const data = usePostsStore(useCallback(postsSelector.getPost(id), [id])) || {};

  const comments = useCommentsStore(commentsSelector.getCommentsByParentId(id));
  const sectionData = getSectionData(comments);

  const actions = useArticlesStore((state: IArticlesState) => state.actions);
  const commonController = useCommonController((state) => state.actions);

  const {
    audience, reactionsCount, setting, ownerReactions,
  } = data;

  const groupIds = useMemo(() => {
    if (isEmpty(audience?.groups)) return '';

    const ids = audience.groups.map((g: IAudienceGroup) => g?.id);
    return ids?.join?.(',');
  }, [data.audience]);

  const isMounted = useMounted();

  useEffect(() => {
    if (isMounted) { actions.getArticleDetail(id); }
  }, [isMounted]);

  const onRefresh = () => {
    setRefreshing(false);
    actions.getArticleDetail(id);
  };

  const onPressMarkSeenPost = useCallback(() => {
    dispatch(postActions.putMarkSeenPost({ postId: id }));
  }, [id]);

  const navigateToCommentDetailScreen = (
    commentData: any,
    replyItem?: any,
    commentParent?: any,
  ) => {
    rootNavigation.navigate(homeStack.commentDetail, {
      commentId: commentData?.id || 0,
      postId: id,
      replyItem,
      commentParent,
    });
  };

  const onPressReplyCommentItem = useCallback(
    (commentData, section) => {
      navigateToCommentDetailScreen(
        section?.comment || {},
        commentData,
        section?.comment,
      );
    },
    [sectionData],
  );

  const onPressReplySectionHeader = useCallback(
    (commentData) => {
      navigateToCommentDetailScreen(commentData, commentData);
    },
    [sectionData],
  );

  const onPressLoadMoreCommentLevel2 = useCallback(
    (commentData: any) => {
      navigateToCommentDetailScreen(commentData);
    },
    [],
  );

  const onPressMentionAudience = useRef((user: IMentionUser) => {
    if (audience) {
      rootNavigation.navigate(
        mainStack.userProfile, { userId: user.id },
      );
    }
  }).current;

  const scrollTo = (sectionIndex = 0, itemIndex = 0) => {
    if (sectionData.length > 0) {
      if (sectionIndex > sectionData.length - 1 || sectionIndex === -1) {
        sectionIndex = sectionData.length - 1;
      }
      if (
        itemIndex > sectionData?.[sectionIndex]?.data?.length
        || itemIndex === -1
      ) {
        itemIndex = sectionData?.[sectionIndex]?.data?.length || 0;
      }

      try {
        listRef?.current?.scrollToLocation?.({
          itemIndex,
          sectionIndex,
          animated: true,
        });
      } catch (error) {
        // scroll to the first comment to avoid scroll error
        listRef?.current?.scrollToLocation?.({
          itemIndex: 0,
          sectionIndex: 0,
          animated: true,
        });
      }
    }
  };

  const onLayout = useCallback(() => {
    if (!layoutSet.current) {
      layoutSet.current = true;
      if (focusComment && comments?.length > 0) {
        // limit section index to default comment length = 10 to avoid scroll crash.
        // it happen when init with large amount of comment,
        // then scroll, then reload, result only 10 latest comment, scroll to out of index
        const sectionIndex = Math.min(9, sectionData.length - 1);
        scrollTo(sectionIndex, -1);
      }
      if (focusComment) {
        commentInputRef.current?.focus?.();
      }
    }
  }, [layoutSet, sectionData.length, focusComment, comments?.length]);

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

  const onInitializeEnd = () => {
    setLoaded(true);
  };

  const onScrollToIndexFailed = () => {
    countRetryScrollToBottom += 1;
    if (countRetryScrollToBottom < 20) {
      setTimeout(() => {
        scrollTo(-1, -1);
        // scrollTo(Math.min(9, sectionData.length - 1), -1);
      }, 100);
    }
  };

  const renderCommentItem = (data: any) => {
    const { item, index, section } = data || {};
    return (
      <CommentItem
        postId={id}
        commentData={item}
        commentParent={section?.comment}
        groupIds={groupIds}
        index={index}
        section={section}
        isReplyingComment={false}
        onPressReply={onPressReplyCommentItem}
        onPressMarkSeenPost={onPressMarkSeenPost}
      />
    );
  };

  const renderSeparator = () => <View />;

  const renderSectionHeader = (sectionData: any) => {
    const { section } = sectionData || {};
    const { comment, index } = section || {};
    return (
      <CommentItem
        postId={id}
        commentData={comment}
        groupIds={groupIds}
        index={index}
        isReplyingComment={false}
        onPressReply={onPressReplySectionHeader}
        onPressLoadMore={onPressLoadMoreCommentLevel2}
        onPressMarkSeenPost={onPressMarkSeenPost}
      />
    );
  };

  const renderFooter = () => {
    if (
      !setting?.canComment
      || sectionData.length === 0
      || sectionData[0].type === 'empty'
    ) {
      return null;
    }

    return <View style={styles.footer} />;
  };

  const renderLoading = () => {
    if (isLoaded) return null;

    return (
      <View style={styles.loadingContainer}>
        <Header
          title="article:title_article_detail"
          titleTextProps={{ useI18n: true }}
        />
        <ArticlePlaceholder />
      </View>
    );
  };

  if (!isMounted || !data) return renderLoading();

  return (
    <View style={styles.container}>
      {renderLoading()}
      <Header />
      <View style={styles.contentContainer}>
        <SectionList
          ref={listRef}
          sections={sectionData}
          renderItem={renderCommentItem}
          renderSectionHeader={renderSectionHeader}
          ListHeaderComponent={(
            <ArticleView
              id={id}
              article={data}
              isLoaded={isLoaded}
              firstCommentId=""
              onAddReaction={onAddReaction}
              onRemoveReaction={onRemoveReaction}
              onInitializeEnd={onInitializeEnd}
              onPressMentionAudience={onPressMentionAudience}
            />
            )}
          ListFooterComponent={renderFooter}
          stickySectionHeadersEnabled={false}
          ItemSeparatorComponent={renderSeparator}
          keyboardShouldPersistTaps="handled"
          onLayout={onLayout}
          onContentSizeChange={onLayout}
          onScrollToIndexFailed={onScrollToIndexFailed}
          refreshControl={(
            <RefreshControl
              testID="post_detail_content.refresh_control"
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
            )}
        />

      </View>
      {!!setting?.canComment && (
      <CommentInputView
        commentInputRef={commentInputRef}
        postId={id}
        groupIds={groupIds}
        autoFocus={!!focusComment}
      />
      )}
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.neutral,
    },
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

// export default ArticleDetail;

const ArticleDetail = memo(_ArticleDetail);
ArticleDetail.whyDidYouRender = true;
export default ArticleDetail;
