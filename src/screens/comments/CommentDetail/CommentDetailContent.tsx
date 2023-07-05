/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import {
  FlatList, RefreshControl, StyleSheet, View,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import CommentItem from '~/beinComponents/list/items/CommentItem';
import CommentViewPlaceholder from '~/beinComponents/placeholder/CommentViewPlaceholder';
import Text from '~/baseComponents/Text';
import { useBaseHook } from '~/hooks';
import { IAudienceGroup, ICommentData } from '~/interfaces/IPost';
import useCommentsStore from '~/store/entities/comments';
import commentsSelector from '~/store/entities/comments/selectors';
import usePostsStore, { IPostsState } from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';

import CommentInputView from '~/screens/comments/components/CommentInputView';
import SVGIcon from '~/baseComponents/Icon/SvgIcon';
import CommentNotFoundImg from '~/../assets/images/img_comment_not_found.svg';
import { useRootNavigation } from '~/hooks/navigation';
import APIErrorCode from '~/constants/apiErrorCode';
import LoadMoreComment from '~/components/LoadMoreComment';
import spacing from '~/theme/spacing';
import useCommentDetailController from './store';
import Divider from '~/beinComponents/Divider';
import { getTitle, replacePostDetail } from './helper';
import useModalStore from '~/store/modal';
import { ToastType } from '~/baseComponents/Toast/BaseToast';
import BannerReport from '~/components/Report/BannerReport';
import { handleScrollToIndexFailed } from '~/helpers/post';

const CommentDetailContent = (props: any) => {
  const [groupIds, setGroupIds] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isScrollFirst, setIsScrollFirst] = useState(false);

  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();

  const commentDetailController = useCommentDetailController(
    (state) => state.actions,
  );
  const { showToast, showAlert } = useModalStore((state) => state.actions);
  const postActions = usePostsStore((state) => state.actions);

  const listRef = useRef<any>();
  const commentInputRef = useRef<any>();

  const params = props?.route?.params;
  const {
    postId,
    replyItem,
    commentParent,
    commentId,
    parentId,
    notiId,
    isReported,
  } = params || {};
  const id = postId;

  const actor = usePostsStore(postsSelector.getActor(id));
  const type = usePostsStore(postsSelector.getType(postId));
  const audience = usePostsStore(postsSelector.getAudience(id));
  const postDetailLoadingState = usePostsStore(
    (state) => state.isLoadingGetPostDetail,
  );
  const { deletePostLocal, putMarkSeenPost, setIsLoadingGetPostDetail }
    = usePostsStore((state: IPostsState) => state.actions);

  let comments = null;
  if (isReported) {
    const comment = useCommentsStore(commentsSelector.getComment(commentId));
    comments = [{ ...comment }];
  } else {
    comments = useCommentsStore(commentsSelector.getCommentsByParentId(id));
  }

  const {
    childrenComments = [],
    newCommentData,
    viewMore = false,
    notFoundComment,
  } = getListChildComment(comments, parentId || commentId);

  const scrollToCommentsPosition = usePostsStore((state) => state.scrollToCommentsPosition);
  const scrollToLatestItem = usePostsStore((state) => state.scrollToLatestItem);

  const copyCommentError = usePostsStore((state) => state.commentErrorCode);

  const headerTitle = t(getTitle(type), {
    name: actor?.fullname || '',
  });

  useEffect(() => {
    if (scrollToLatestItem) {
      onCommentSuccess();
    }
  }, [scrollToLatestItem]);

  const onCommentSuccess = () => {
    scrollToIndex({ isScrollToBottom: true });
    postActions.setScrollToLatestItem(false);
  };

  useEffect(() => {
    if (audience?.groups?.length > 0) {
      const ids: any = [];
      audience.groups.map((g: IAudienceGroup) => ids.push(g?.id));
      setGroupIds(ids?.join?.(','));
    }
  }, [audience?.groups]);

  useEffect(() => {
    if (copyCommentError === APIErrorCode.Post.POST_PRIVACY) {
      props?.showPrivacy?.(true);
    } else if (
      copyCommentError === APIErrorCode.Post.COPIED_COMMENT_IS_DELETED
      && !postDetailLoadingState
    ) {
      setIsEmpty(true);
      showToast({
        content: 'post:text_comment_was_deleted',
        type: ToastType.ERROR,
      });
      replacePostDetail(type, postId);
    }
    if (copyCommentError === APIErrorCode.Post.POST_DELETED && !!notiId) {
      deletePostLocal(id);
      showToast({ content: 'post:error_post_detail_deleted' });
      rootNavigation.popToTop();
    }
    if (!postDetailLoadingState && !copyCommentError) {
      postActions.setScrollCommentsPosition(null);
      commentDetailController.getCommentDetail({
        commentId,
        params: { postId },
        isReported,
        callbackLoading: (loading: boolean) => {
          setLoading(loading);
          if (!loading && !!replyItem) {
            postActions.setPostDetailReplyingComment({
              comment: replyItem,
              parentComment: commentParent,
            });
          }
        },
      });
    }
  }, [postDetailLoadingState, copyCommentError]);

  useEffect(() => {
    if (
      !loading
      && (notFoundComment === undefined || notFoundComment < 0)
      && !isEmpty
      && !copyCommentError
      && !isReported
    ) {
      showToast({
        content: 'error:not_found_desc',
        type: ToastType.ERROR,
      });
      if (rootNavigation.canGoBack) {
        setTimeout(() => {
          rootNavigation.goBack();
        }, 200);
      }
    }
  }, [notFoundComment, loading, isEmpty, copyCommentError]);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        if (scrollToCommentsPosition?.position === 'top') {
          postActions.setScrollCommentsPosition(null);
        } else if (scrollToCommentsPosition?.position === 'bottom') {
          scrollToIndex({ isScrollToBottom: true });
        } else if (!!parentId && childrenComments?.length > 0 && !isScrollFirst) {
          const commentPosition = childrenComments?.findIndex?.((item: ICommentData) => item.id == commentId);
          if (commentPosition > 0) {
            setIsScrollFirst(true);
            scrollToIndex({ index: commentPosition });
          }
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [scrollToCommentsPosition, childrenComments, loading]);

  const scrollToIndex = (payload: { isScrollToBottom?: boolean, index?: number}) => {
    const { isScrollToBottom = false, index } = payload;
    try {
      if (isScrollToBottom) {
        listRef.current?.scrollToEnd?.({
          animated: true,
        });
      } else {
        const position = childrenComments?.length || 1;
        listRef.current?.scrollToIndex?.({
          animated: true,
          index: index || (position > 0 ? position : 0),
        });
      }
      postActions.setScrollCommentsPosition(null);
    } catch (error) {
      // scroll to the first comment to avoid scroll error
      listRef.current?.scrollToOffset?.({ animated: true, offset: 0 });
    }
  };

  const onScrollToIndexFailed = (error: any) => {
    handleScrollToIndexFailed({ error, listRef });
  };

  const showNotice = (type = 'deleted_comment') => {
    showAlert({
      HeaderImageComponent: (
        <View style={{ alignItems: 'center' }}>
          <SVGIcon
            // @ts-ignore
            source={CommentNotFoundImg}
            width={120}
            height={120}
            tintColor="none"
          />
        </View>
      ),
      title: t(`post:${type}:title`),
      titleProps: { style: { flex: 1, textAlign: 'center' } },
      cancelBtn: false,
      isDismissible: true,
      onConfirm: () => {
        if (type === 'deleted_post') {
          rootNavigation.popToTop();
        } else {
          rootNavigation.goBack();
        }
      },
      confirmLabel: t(`post:${type}:button_text`),
      content: t(`post:${type}:description`),
      contentProps: { style: { textAlign: 'center' } },
      ContentComponent: Text.BodyS,
      buttonViewStyle: { justifyContent: 'center' },
      headerStyle: { marginBottom: 0 },
      onDismiss: () => {
        if (type === 'deleted_post') {
          rootNavigation.popToTop();
        } else {
          rootNavigation.goBack();
        }
      },
    });
  };

  const onRefresh = () => {
    if (copyCommentError === APIErrorCode.Post.COMMENT_DELETED) {
      setIsEmpty(true);
      setRefreshing(true);
      showNotice();
      setRefreshing(false);
      return;
    }
    if (copyCommentError === APIErrorCode.Post.POST_DELETED) {
      setIsLoadingGetPostDetail(true);
      setIsEmpty(true);
      setRefreshing(true);
      showNotice('deleted_post');
      setRefreshing(false);
      return;
    }
    commentDetailController.getCommentDetail({
      commentId: parentId || commentId,
      params: { postId },
      isReported,
      callbackLoading: (_loading: boolean) => {
        setRefreshing(_loading);
      },
    });
  };

  const onPressMarkSeenPost = useCallback(() => {
    putMarkSeenPost({ postId });
  }, [postId]);

  const renderCommentItem = (data: any) => {
    const { item, index } = data || {};
    return (
      <CommentItem
        postId={id}
        commentData={item}
        commentParent={newCommentData}
        groupIds={groupIds}
        audience={audience}
        index={index}
        onPressMarkSeenPost={onPressMarkSeenPost}
      />
    );
  };

  const renderFooter = () => {
    if (viewMore) {
      const startCursor = newCommentData?.child?.meta?.startCursor;
      const _parentId = parentId || commentId;
      return (
        <LoadMoreComment
          title="post:text_load_more_replies"
          postId={id}
          startCursor={startCursor}
          commentId={_parentId}
        />
      );
    }
    return <View style={styles.footerList} />;
  };

  const renderCommentInputView = () => {
    if (isReported) {
      return null;
    }
    return (
      <CommentInputView
        commentInputRef={commentInputRef}
        postId={id}
        groupIds={groupIds}
        autoFocus={!!replyItem}
        showHeader
        viewMore={viewMore}
        defaultReplyTargetId={newCommentData?.id}
      />
    );
  };

  if (loading || postDetailLoadingState) {
    return <CommentViewPlaceholder />;
  }

  const keyExtractor = (item: any) => `CommentDetailContent_${item?.id || ''}`;

  if (isEmpty) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} testID="comment_detail_content">
      <BannerReport commentId={commentId} />
      <FlatList
        ref={listRef}
        testID="list"
        data={childrenComments || []}
        renderItem={renderCommentItem}
        ListHeaderComponent={(
          <CommentLevel1
            color={theme.colors.neutral5}
            headerTitle={headerTitle}
            commentData={newCommentData}
            groupIds={groupIds}
            audience={audience}
            id={id}
            isReported={isReported}
            onPressMarkSeenPost={onPressMarkSeenPost}
          />
        )}
        ListFooterComponent={renderFooter}
        keyboardShouldPersistTaps="handled"
        keyExtractor={keyExtractor}
        onScrollToIndexFailed={onScrollToIndexFailed}
        scrollEventThrottle={16}
        refreshControl={(
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.gray40}
          />
        )}
        contentContainerStyle={styles.contentContainerStyle}
      />
      {renderCommentInputView()}
    </View>
  );
};

const CommentLevel1 = ({
  id,
  commentData,
  groupIds,
  audience,
  onPressMarkSeenPost,
  color,
  isReported,
}: any) => {
  if (!id && !isReported) {
    return null;
  }

  return (
    <View testID="comment_level_1">
      <Divider size={spacing.padding.large} color={color} />
      <CommentItem
        postId={id}
        commentData={commentData}
        groupIds={groupIds}
        audience={audience}
        index={0}
        showRepliesComment={false}
        onPressMarkSeenPost={onPressMarkSeenPost}
      />
    </View>
  );
};

const getListChildComment = (
  listData: ICommentData[],
  parentCommentId: string,
) => {
  const parentCommentPosition = listData?.findIndex?.(
    (item: ICommentData) => item.id === parentCommentId,
  );

  const childrenComments = listData?.[parentCommentPosition]?.child?.list || [];
  return {
    childrenComments,
    newCommentData: listData?.[parentCommentPosition],
    viewMore:
      listData?.[parentCommentPosition]?.child?.meta?.hasPreviousPage || false,
    notFoundComment: parentCommentPosition,
  };
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      paddingLeft: spacing.padding.large,
      paddingVertical: spacing.padding.small,
      flexDirection: 'row',
    },
    highlightText: {
      color: colors.blue50,
    },
    headerText: {
      fontSize: 14,
    },
    footer: {
      backgroundColor: colors.white,
      paddingHorizontal: spacing.padding.large,
      paddingBottom: spacing.padding.extraLarge,
      paddingTop: spacing.padding.large,
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    footerList: {
      height: spacing.margin.base,
      backgroundColor: colors.white,
    },
    contentContainerStyle: {
      backgroundColor: colors.white,
    },
  });
};

export default CommentDetailContent;
