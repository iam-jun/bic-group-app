import { useCallback, useEffect, useRef } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { handleScrollToIndexFailed } from '~/helpers/post';
import { useRootNavigation } from '~/hooks/navigation';
import { ICommentData } from '~/interfaces/IPost';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import usePostsStore from '~/store/entities/posts';

const usePostDetailContentHandler = ({
  postId,
  comments,
  focusComment,
  listRef,
  commentInputRef,
  commentId,
}) => {
  const { rootNavigation } = useRootNavigation();
  const scrollToLatestItem = usePostsStore((state) => state.scrollToLatestItem);
  const postActions = usePostsStore((state) => state.actions);

  const layoutSet = useRef(false);

  useEffect(() => {
    if (scrollToLatestItem) {
      onCommentSuccess();
    }
  }, [scrollToLatestItem]);

  const onCommentSuccess = () => {
    scrollTo({ isScrollToBottom: true });
    postActions.setScrollToLatestItem(false);
  };

  const scrollTo = (payload: { isScrollToBottom?: boolean; index?: number }) => {
    setTimeout(() => _scrollTo(payload), 1000);
  };

  const _scrollTo = (payload: { isScrollToBottom?: boolean; index?: number }) => {
    const { isScrollToBottom = false, index = 0 } = payload;
    if (comments?.length > 0) {
      try {
        if (isScrollToBottom) {
          listRef?.current?.scrollToIndex?.({
            index: comments.length - 1,
            animated: true,
          });
        } else {
          listRef?.current?.scrollToIndex?.({
            index,
            animated: true,
          });
        }
      } catch (error) {
        // scroll to the first comment to avoid scroll error
        listRef?.current?.scrollToIndex?.({
          index: 0,
          animated: true,
        });
      }
    }
  };

  const onScrollToIndexFailed = (error: any) => {
    handleScrollToIndexFailed({ error, listRef });
  };

  const onPressComment = useCallback(() => {
    scrollTo({ isScrollToBottom: true });
    commentInputRef.current?.focus?.();
  }, [commentInputRef, comments?.length]);

  const navigateToCommentDetailScreen = (
    commentData: any,
    replyItem?: any,
    commentParent?: any,
  ) => {
    rootNavigation.navigate(homeStack.commentDetail, {
      commentId: commentData?.id || 0,
      postId,
      replyItem,
      commentParent,
    });
  };

  const onPressReplySectionHeader = useCallback(
    (commentData) => {
      navigateToCommentDetailScreen(commentData, commentData);
    },
    [comments],
  );

  const onPressLoadMoreCommentLevel2 = useCallback(
    (commentData: any) => {
      navigateToCommentDetailScreen(commentData);
    },
    [],
  );

  useEffect(() => {
    if (!layoutSet.current) {
      if (comments?.length > 0) {
        // limit section index to default comment length = 10 to avoid scroll crash.
        // it happen when init with large amount of comment,
        // then scroll, then reload, result only 10 latest comment, scroll to out of index;
        if (commentId) {
          const index = comments.findIndex((item: ICommentData) => item.id === commentId);
          scrollTo({ index });
        } else if (focusComment) {
          scrollTo({ isScrollToBottom: true });
        }
        layoutSet.current = true;
      }
      if (focusComment) {
        commentInputRef.current?.focus?.();
      }
    }
  }, [layoutSet, focusComment, comments?.length]);

  const onScroll = () => {
    DeviceEventEmitter.emit('stopAllVideo');
  };

  return {
    onScroll,
    onPressComment,
    onScrollToIndexFailed,
    onPressReplySectionHeader,
    onPressLoadMoreCommentLevel2,
  };
};

export default usePostDetailContentHandler;
