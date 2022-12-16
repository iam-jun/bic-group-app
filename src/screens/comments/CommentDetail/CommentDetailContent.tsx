/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import {
  FlatList, RefreshControl, StyleSheet, View,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import CommentItem from '~/beinComponents/list/items/CommentItem';
import CommentViewPlaceholder from '~/beinComponents/placeholder/CommentViewPlaceholder';
import Text from '~/baseComponents/Text';
import { useBaseHook } from '~/hooks';
import { useKeySelector } from '~/hooks/selector';
import { IAudienceGroup, ICommentData } from '~/interfaces/IPost';
import useCommentsStore from '~/store/entities/comments';
import commentsSelector from '~/store/entities/comments/selectors';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import modalActions from '~/storeRedux/modal/actions';

import CommentInputView from '~/screens/comments/components/CommentInputView';
import postActions from '~/storeRedux/post/actions';
import postKeySelector from '~/storeRedux/post/keySelector';
import SVGIcon from '~/baseComponents/Icon/SvgIcon';
import CommentNotFoundImg from '~/../assets/images/img_comment_not_found.svg';
import { useRootNavigation } from '~/hooks/navigation';
import APIErrorCode from '~/constants/apiErrorCode';
import LoadMoreComment from '~/components/LoadMoreComment';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import spacing from '~/theme/spacing';
import useCommentDetailController from './store';
import Divider from '~/beinComponents/Divider';

const CommentDetailContent = (props: any) => {
  const [groupIds, setGroupIds] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isScrollFirst, setIsScrollFirst] = useState(false);

  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const { t } = useBaseHook();
  const dispatch = useDispatch();
  const { rootNavigation, goHome } = useRootNavigation();

  const commentDetailController = useCommentDetailController((state) => state.actions);

  const listRef = useRef<any>();
  const commentInputRef = useRef<any>();

  const params = props?.route?.params;
  const {
    postId, replyItem, commentParent, commentId, parentId, notiId,
  }
    = params || {};
  const id = postId;

  const actor = usePostsStore(postsSelector.getActor(id));
  const audience = usePostsStore(postsSelector.getAudience(id));
  const postDetailLoadingState = useKeySelector(
    postKeySelector.loadingGetPostDetail,
  );
  const comments = useCommentsStore(commentsSelector.getCommentsByParentId(id));
  const {
    childrenComments = [],
    newCommentData,
    viewMore = false,
    notFoundComment,
  } = getListChildComment(comments, parentId || commentId);

  const scrollToCommentsPosition = useKeySelector(
    postKeySelector.scrollToCommentsPosition,
  );

  const copyCommentError = useKeySelector(postKeySelector.commentErrorCode);

  const headerTitle = t('post:title_comment_detail_of', {
    name: actor?.fullname || '',
  });

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
      dispatch(
        modalActions.showHideToastMessage({
          content: 'post:text_comment_was_deleted',
          props: { type: 'error' },
        }),
      );
      rootNavigation.replace(homeStack.postDetail, { post_id: postId });
    }
    if (copyCommentError === APIErrorCode.Post.POST_DELETED && !!notiId) {
      dispatch(postActions.deletePostLocal(id));
      dispatch(
        modalActions.showHideToastMessage({ content: 'post:error_post_detail_deleted' }),
      );
      rootNavigation.popToTop();
    }
    if (!postDetailLoadingState && !copyCommentError) {
      dispatch(postActions.setScrollCommentsPosition(null));
      commentDetailController.getCommentDetail({
        commentId,
        params: { postId },
        callbackLoading: (loading: boolean) => {
          setLoading(loading);
          if (!loading && !!replyItem) {
            dispatch(
              postActions.setPostDetailReplyingComment({
                comment: replyItem,
                parentComment: commentParent,
              }),
            );
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
    ) {
      dispatch(
        modalActions.showHideToastMessage({
          content: 'error:not_found_desc',
          props: { type: 'error' },
        }),
      );
      goHome();
    }
  }, [notFoundComment, loading, isEmpty, copyCommentError]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollToCommentsPosition?.position === 'top') {
        dispatch(postActions.setScrollCommentsPosition(null));
      } else if (scrollToCommentsPosition?.position === 'bottom') {
        scrollToIndex();
      } else if (!!parentId && childrenComments?.length > 0 && !isScrollFirst) {
        const commentPosition = childrenComments?.findIndex?.(
          (item: ICommentData) => item.id == commentId,
        );
        if (commentPosition > 0) {
          setIsScrollFirst(true);
          scrollToIndex(commentPosition);
        }
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [scrollToCommentsPosition, childrenComments]);

  const scrollToIndex = (index?: number) => {
    try {
      const position = childrenComments?.length || 1;
      listRef.current?.scrollToIndex?.({
        animated: true,
        index: index || (position > 0 ? position : 0),
      });
      dispatch(postActions.setScrollCommentsPosition(null));
    } catch (error) {
      // scroll to the first comment to avoid scroll error
      listRef.current?.scrollToOffset?.({ animated: true, offset: 0 });
    }
  };

  const onScrollToIndexFailed = (error: any) => {
    const offset = (error?.averageItemLength || 0) * (error?.index || 0);
    listRef.current?.scrollToOffset?.({ offset });
    setTimeout(
      () => listRef.current?.scrollToIndex?.({ index: error?.index || 0 }),
      100,
    );
  };

  const goToPostDetail = () => {
    rootNavigation.replace(homeStack.postDetail, {
      post_id: postId,
    });
  };

  const showNotice = (type = 'deleted_comment') => {
    dispatch(
      modalActions.showAlert({
        // @ts-ignore
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
      }),
    );
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
      dispatch(postActions.setLoadingGetPostDetail(true));
      setIsEmpty(true);
      setRefreshing(true);
      showNotice('deleted_post');
      setRefreshing(false);
      return;
    }
    commentDetailController.getCommentDetail({
      commentId: parentId || commentId,
      params: { postId },
      callbackLoading: (_loading: boolean) => {
        setRefreshing(_loading);
      },
    });
  };

  const onPressMarkSeenPost = useCallback(() => {
    dispatch(postActions.putMarkSeenPost({ postId }));
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
      const commentLength = newCommentData?.child?.list?.length || 0;
      const lastItem = newCommentData?.child?.list?.[commentLength - 1];
      const _parentId = parentId || commentId;
      return (
        <LoadMoreComment
          title="post:text_load_more_replies"
          postId={id}
          idGreaterThan={lastItem?.id}
          commentId={_parentId}
        />
      );
    }
    return <View style={styles.footerList} />;
  };

  if (loading || postDetailLoadingState) {
    return <CommentViewPlaceholder />;
  }

  const keyExtractor = (item: any) => `CommentDetailContent_${item?.id || ''}`;

  if (isEmpty) {
    return null;
  }
  return (
    <View style={{ flex: 1 }}>
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
            onPress={goToPostDetail}
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
      <CommentInputView
        commentInputRef={commentInputRef}
        postId={id}
        groupIds={groupIds}
        autoFocus={!!replyItem}
        isCommentLevel1Screen
        showHeader
        viewMore={viewMore}
        defaultReplyTargetId={newCommentData?.id}
      />
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
}: any) => {
  if (!id) {
    return null;
  }

  return (
    <View>
      <Divider
        size={spacing.padding.large}
        color={color}
      />
      <CommentItem
        postId={id}
        commentData={commentData}
        groupIds={groupIds}
        audience={audience}
        index={0}
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
