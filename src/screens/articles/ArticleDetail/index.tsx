import React, {
  FC, useCallback, useEffect, useRef, useState,
} from 'react';
import {
  RefreshControl, SectionList, StyleSheet, View,
} from 'react-native';

import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useRootNavigation } from '~/hooks/navigation';
import {
  IAudienceGroup, ICommentData, IMentionUser, IPayloadReactToPost,
} from '~/interfaces/IPost';
import mainStack from '~/router/navigator/MainStack/stack';

import spacing, { margin } from '~/theme/spacing';
import useArticlesStore, { IArticlesState } from '~/screens/articles/ArticleDetail/store';
import { useBaseHook } from '~/hooks';
import Header from '~/beinComponents/Header';
import { IRouteParams } from '~/interfaces/IRouter';
import ArticleHeader from '../components/ArticleHeader';
import Text from '~/beinComponents/Text';
import HashTags from '../components/HashTags';
import useMounted from '~/hooks/mounted';
import ArticleFooter from '../components/ArticleFooter';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import CommentInputView from '~/screens/post/components/CommentInputView';
import useCommentsStore from '~/store/entities/comments';
import commentsSelector from '~/store/entities/comments/selectors';
import CommentItem from '~/beinComponents/list/items/CommentItem';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import postActions from '~/storeRedux/post/actions';
import ArticleReactions from '../components/ArticleReactions';
import Divider from '~/beinComponents/Divider';
import { ReactionType } from '~/constants/reactions';
import useCommonController from '~/screens/store';
import LoadMoreComment from '~/screens/post/components/LoadMoreComment';
import ArticleWebview from '../components/ArticleWebview';
import { getById } from '~/store/entities/selectors';
import ArticlePlaceholder from '../components/ArticleWebview/components/ArticlePlaceholder';

const ArticleDetail: FC<IRouteParams> = (props) => {
  const { params } = props.route;
  const id = params?.articleId;
  const focusComment = params?.focusComment;

  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const dispatch = useDispatch();

  const listRef = useRef<any>();
  const commentInputRef = useRef<any>();
  const layoutSet = useRef(false);
  let countRetryScrollToBottom = useRef(0).current;

  const [groupIds, setGroupIds] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const [isLoaded, setLoaded] = useState(false);

  const articleFromStore = useArticlesStore(useCallback(getById(id), [id]));
  const articleFromPostStore = usePostsStore(useCallback(postsSelector.getPost(id), []));
  const data = articleFromStore || articleFromPostStore || {};

  const canLoadMoreComment = usePostsStore(postsSelector.getCommentOnlyCount(id));

  const comments = useCommentsStore(commentsSelector.getCommentsByParentId(id));
  const sectionData = getSectionData(comments) || [];

  const actions = useArticlesStore((state: IArticlesState) => state.actions);
  const commonController = useCommonController((state) => state.actions);

  const {
    title, audience, actor, createdAt, commentsCount,
    reactionsCount, setting, hashtags, ownerReactions,
  } = data || {};
  const commentCountText = commentsCount || '';
  const labelButtonComment = `${commentCountText}${t('post:button_comment')}`;

  const isMounted = useMounted();

  useEffect(() => {
    actions.getArticleDetail(id);
  }, []);

  useEffect(() => {
    if (audience?.groups?.length > 0) {
      const ids: any = [];
      audience.groups.map((g: IAudienceGroup) => ids.push(g?.id));
      setGroupIds(ids?.join?.(','));
    }
  }, [audience?.groups]);

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

  const onInitializeEnd = () => setLoaded(true);

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

  const renderHeader = () => (
    <View style={styles.postContainerBackground}>
      <ArticleHeader
        articleId={id}
        actor={actor}
        time={createdAt}
        audience={audience}
      />
      <View style={styles.postContainer}>
        <Text.H3
          testID="post_view_content"
          style={styles.title}
        >
          {title}
        </Text.H3>
        <ArticleWebview
          readOnly
          articleData={data}
          onInitializeEnd={onInitializeEnd}
          onPressMentionAudience={onPressMentionAudience}
        />
        <HashTags data={hashtags} />
        <Divider />
      </View>
      <ArticleReactions
        id={id}
        ownerReactions={ownerReactions}
        reactionsCount={reactionsCount}
        onAddReaction={onAddReaction}
        onRemoveReaction={onRemoveReaction}
      />
      <ArticleFooter
        articleId={id}
        labelButtonComment={labelButtonComment}
        reactionCounts={reactionsCount}
        canReact={setting?.canReact}
        canComment={setting?.canComment}
        onAddReaction={onAddReaction}
      />
      <Divider style={styles.divider} />
      {
         canLoadMoreComment && (
         <LoadMoreComment
           title="post:text_load_more_comments"
           postId={id}
           idLessThan={comments?.[0]?.id}
         />
         )
        }
    </View>
  );

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
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          stickySectionHeadersEnabled={false}
          ItemSeparatorComponent={() => <View />}
          keyboardShouldPersistTaps="handled"
          onLayout={onLayout}
          onContentSizeChange={onLayout}
          // onScroll={onscroll}
          onScrollToIndexFailed={onScrollToIndexFailed}
          refreshControl={(
            <RefreshControl
              testID="post_detail_content.refresh_control"
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
            )}
        />
        {!!setting?.canComment && (
          <CommentInputView
            commentInputRef={commentInputRef}
            postId={id}
            groupIds={groupIds}
            autoFocus={!!focusComment}
          />
        )}
      </View>
    </View>
  );
};

const getSectionData = (listComment: ICommentData[]) => {
  const result: any[] = [];
  listComment?.forEach?.((comment, index) => {
    const item: any = {};
    const lastChildComment = comment?.child?.list || [];
    const _data
      = lastChildComment.length > 0
        ? [lastChildComment[lastChildComment.length - 1]]
        : [];
    item.comment = comment;
    item.index = index;
    item.data = _data;
    result.push(item);
  });
  // long post without comment cant scroll to bottom
  // so need default list with an empty item to trigger scroll
  return result?.length > 0 ? result : [];
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
      opacity: 0.5,
    },
    postContainerBackground: {
      backgroundColor: colors.white,
    },
    postContainer: {
      marginVertical: spacing.margin.small,
      // paddingHorizontal: spacing.margin.large,
    },
    title: {
      marginVertical: margin.base,
      marginHorizontal: spacing.margin.large,
    },
    footer: {
      height: spacing.margin.base,
      backgroundColor: colors.white,
    },
    divider: {
      marginHorizontal: spacing.margin.large,
    },
  });
};

export default ArticleDetail;
