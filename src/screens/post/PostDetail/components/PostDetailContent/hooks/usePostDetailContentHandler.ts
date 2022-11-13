import { useCallback, useEffect, useRef } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { useDispatch } from 'react-redux';
import { useRootNavigation } from '~/hooks/navigation';
import { useKeySelector } from '~/hooks/selector';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import postActions from '~/storeRedux/post/actions';
import postKeySelector from '~/storeRedux/post/keySelector';

const usePostDetailContentHandler = ({
  postId, comments, sectionData, focusComment, listRef, commentInputRef,
}) => {
  const { rootNavigation } = useRootNavigation();
  const dispatch = useDispatch();
  const scrollToLatestItem = useKeySelector(postKeySelector.scrollToLatestItem);

  const countRetryScrollToBottom = useRef(0);
  const layoutSet = useRef(false);

  useEffect(() => {
    if (scrollToLatestItem) {
      onCommentSuccess(scrollToLatestItem);
      dispatch(postActions.setScrollToLatestItem(null));
    }
  }, [scrollToLatestItem]);

  const onCommentSuccess = useCallback(
    ({
      parentCommentId,
    }: {
      newCommentId: string;
      parentCommentId?: string;
    }) => {
      let sectionIndex;
      let itemIndex = 0;
      if (parentCommentId) {
        sectionData?.forEach?.((section, index) => {
          if (section?.comment?.id === parentCommentId) {
            sectionIndex = index;
            itemIndex = section?.data?.length || 0;
          }
        });
      } else {
        sectionIndex = sectionData.length - 1;
      }
      scrollTo(sectionIndex, itemIndex);
    },
    [sectionData],
  );

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

  const onScrollToIndexFailed = () => {
    countRetryScrollToBottom.current += 1;
    if (countRetryScrollToBottom.current < 20) {
      setTimeout(() => {
        scrollTo(-1, -1);
        // scrollTo(Math.min(9, sectionData.length - 1), -1);
      }, 100);
    }
  };

  const onPressComment = useCallback(() => {
    scrollTo(-1, -1);
    commentInputRef.current?.focus?.();
  }, [commentInputRef, sectionData.length]);

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
    [sectionData],
  );

  const onPressLoadMoreCommentLevel2 = useCallback(
    (commentData: any) => {
      navigateToCommentDetailScreen(commentData);
    },
    [],
  );

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

  const onScroll = () => {
    DeviceEventEmitter.emit('stopAllVideo');
  };

  return {
    onLayout,
    onScroll,
    onPressComment,
    onScrollToIndexFailed,
    onPressReplySectionHeader,
    onPressLoadMoreCommentLevel2,
    onPressReplyCommentItem,
  };
};

export default usePostDetailContentHandler;
