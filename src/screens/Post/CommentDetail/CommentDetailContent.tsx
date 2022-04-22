import React, {useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import CommentItem from '~/beinComponents/list/items/CommentItem';
import CommentViewPlaceholder from '~/beinComponents/placeholder/CommentViewPlaceholder';
import Text from '~/beinComponents/Text';
import {useBaseHook} from '~/hooks';
import {useKeySelector} from '~/hooks/selector';
import {IAudienceGroup, ICommentData} from '~/interfaces/IPost';
import {ITheme} from '~/theme/interfaces';
import CommentInputView from '../components/CommentInputView';
import postActions from '../redux/actions';
import postKeySelector from '../redux/keySelector';

const CommentDetailContent = (props: any) => {
  const [groupIds, setGroupIds] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const {t} = useBaseHook();
  const dispatch = useDispatch();

  const listRef = useRef<any>();
  const commentInputRef = useRef<any>();

  const params = props?.route?.params;
  const {commentData, postId, replyItem, commentParent} = params || {};

  const id = postId;
  const actor = useKeySelector(postKeySelector.postActorById(id));
  const audience = useKeySelector(postKeySelector.postAudienceById(id));
  const postDetailLoadingState = useKeySelector(
    postKeySelector.loadingGetPostDetail,
  );

  const comments = useKeySelector(postKeySelector.commentsByParentId(id));
  const {childrenComments = [], newCommentData = {}} = getListChildComment(
    comments,
    commentData?.id,
  );

  const scrollToCommentsPosition = useKeySelector(
    postKeySelector.scrollToCommentsPosition,
  );

  const headerTitle = t('post:title_comment_detail_of').replace(
    '%NAME%',
    actor?.fullname || '',
  );

  useEffect(() => {
    if (audience?.groups?.length > 0) {
      const ids: any = [];
      audience.groups.map((g: IAudienceGroup) => ids.push(g?.id));
      setGroupIds(ids?.join?.(','));
    }
  }, [audience?.groups]);

  useEffect(() => {
    if (!postDetailLoadingState) {
      dispatch(postActions.setScrollCommentsPosition(null));
      if (
        childrenComments?.length > 1 ||
        !commentData?.latest_children?.comment?.[0]
      ) {
        setLoading(false);
        if (!!replyItem) {
          setTimeout(() => {
            dispatch(
              postActions.setPostDetailReplyingComment({
                comment: replyItem,
                parentComment: commentParent,
              }),
            );
          }, 50);
        }
      } else {
        const lastItem = newCommentData?.child?.[0];
        dispatch(
          postActions.getCommentsByPostId({
            postId: postId,
            idLT: lastItem?.id,
            parentId: newCommentData?.id,
            limit: 9,
            isMerge: true,
            position: 'bottom',
            callbackLoading: loading => {
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
          }),
        );
      }
    }
  }, [postDetailLoadingState]);

  useEffect(() => {
    if (scrollToCommentsPosition?.position === 'top') {
      dispatch(postActions.setScrollCommentsPosition(null));
    } else if (scrollToCommentsPosition?.position === 'bottom') {
      scrollToEnd();
    }
  }, [scrollToCommentsPosition]);

  const scrollToEnd = () => {
    try {
      listRef.current?.scrollToIndex?.({
        animated: true,
        index: childrenComments?.length - 1 || 0,
      });
      dispatch(postActions.setScrollCommentsPosition(null));
    } catch (error) {
      // scroll to the first comment to avoid scroll error
      listRef.current?.scrollToOffset?.({animated: true, offset: 0});
    }
  };

  const onScrollToIndexFailed = (error: any) => {
    const offset = error?.averageItemLength * error?.index || 0;
    listRef.current?.scrollToOffset?.({offset});
    setTimeout(
      () => listRef.current?.scrollToIndex?.({index: error?.index || 0}),
      100,
    );
  };

  const renderCommentItem = (data: any) => {
    const {item, index} = data || {};
    return (
      <CommentItem
        postId={id}
        commentData={item}
        commentParent={newCommentData}
        groupIds={groupIds}
        index={index}
      />
    );
  };

  const renderFooter = () => {
    return <View style={styles.footer} />;
  };

  if (loading || postDetailLoadingState) {
    return <CommentViewPlaceholder />;
  }

  const keyExtractor = (item: any) => `CommentDetailContent_${item?.id || ''}`;

  return (
    <View style={{flex: 1}}>
      <FlatList
        ref={listRef}
        data={childrenComments || []}
        renderItem={renderCommentItem}
        ListHeaderComponent={
          <CommentLevel1
            headerTitle={headerTitle}
            commentData={newCommentData}
            groupIds={groupIds}
            id={id}
          />
        }
        ListFooterComponent={renderFooter}
        keyboardShouldPersistTaps={'handled'}
        keyExtractor={keyExtractor}
        onScrollToIndexFailed={onScrollToIndexFailed}
        scrollEventThrottle={16}
      />
      <CommentInputView
        commentInputRef={commentInputRef}
        postId={id}
        groupIds={groupIds}
        autoFocus={!!replyItem}
        isCommentLevel1Screen
        showHeader
        defaultReplyTargetId={newCommentData?.id}
      />
    </View>
  );
};

const CommentLevel1 = ({id, headerTitle, commentData, groupIds}: any) => {
  if (!id) {
    return null;
  }
  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  return (
    <View>
      <View style={styles.container}>
        <Text.BodySM>
          {t('post:text_comment_from')}
          <Text.BodyM style={styles.highlightText}>{headerTitle}</Text.BodyM>
        </Text.BodySM>
      </View>
      <CommentItem
        postId={id}
        commentData={commentData}
        groupIds={groupIds}
        index={0}
      />
    </View>
  );
};

const getListChildComment = (
  listData: ICommentData[],
  parentCommentId: number,
) => {
  const parentCommentPosition = listData?.findIndex?.(
    (item: ICommentData) => item.id === parentCommentId,
  );
  const childrenComments = listData?.[parentCommentPosition]?.child || [];
  return {childrenComments, newCommentData: listData?.[parentCommentPosition]};
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.small,
      flexDirection: 'row',
    },
    highlightText: {
      color: colors.link,
    },
    headerText: {
      fontSize: 14,
    },
    footer: {height: spacing.margin.base, backgroundColor: colors.background},
  });
};

export default CommentDetailContent;
