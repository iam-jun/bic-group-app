import React, {useEffect, useRef, useState} from 'react';
import {FlatList, RefreshControl, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import CommentItem from '~/beinComponents/list/items/CommentItem';
import CommentViewPlaceholder from '~/beinComponents/placeholder/CommentViewPlaceholder';
import Text from '~/beinComponents/Text';
import {useBaseHook} from '~/hooks';
import {useKeySelector} from '~/hooks/selector';
import {IAudienceGroup, ICommentData} from '~/interfaces/IPost';
import modalActions from '~/store/modal/actions';
import {ITheme} from '~/theme/interfaces';
import CommentInputView from '../components/CommentInputView';
import postActions from '../redux/actions';
import postKeySelector from '../redux/keySelector';
import SVGIcon from '~/beinComponents/Icon/SvgIcon';
import CommentNotFoundImg from '~/../assets/images/img_comment_not_found.svg';
import {useRootNavigation} from '~/hooks/navigation';

const CommentDetailContent = (props: any) => {
  const [groupIds, setGroupIds] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const {t} = useBaseHook();
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();

  const listRef = useRef<any>();
  const commentInputRef = useRef<any>();

  const params = props?.route?.params;
  const {commentData, postId, replyItem, commentParent, commentId, parentId} =
    params || {};
  const id = postId;

  const actor = useKeySelector(postKeySelector.postActorById(id));
  const audience = useKeySelector(postKeySelector.postAudienceById(id));
  const postDetailLoadingState = useKeySelector(
    postKeySelector.loadingGetPostDetail,
  );

  const comments = useKeySelector(postKeySelector.commentsByParentId(id));
  const {childrenComments = [], newCommentData = {}} = getListChildComment(
    comments,
    commentData?.id || !!parentId ? parentId : commentId,
  );

  const scrollToCommentsPosition = useKeySelector(
    postKeySelector.scrollToCommentsPosition,
  );

  const parentCommentIsDeleted = useKeySelector(
    postKeySelector.parentCommentIsDeleted,
  );

  const headerTitle = t('post:title_comment_detail_of').replace(
    '%NAME%',
    actor?.fullname || '',
  );

  useEffect(() => {
    dispatch(postActions.setParentCommentDeleted(false));
  }, []);

  useEffect(() => {
    if (audience?.groups?.length > 0) {
      const ids: any = [];
      audience.groups.map((g: IAudienceGroup) => ids.push(g?.id));
      setGroupIds(ids?.join?.(','));
    }
  }, [audience?.groups]);

  useEffect(() => {
    if (!postDetailLoadingState && !parentCommentIsDeleted) {
      dispatch(postActions.setScrollCommentsPosition(null));
      if (childrenComments?.length > 1 || !commentData?.child?.[0]) {
        setLoading(false);
        if (!!commentId) {
          dispatch(
            postActions.getCommentDetail({
              commentId,
              parentId: parentId || 0,
              order: 'DESC',
            }),
          );
        }
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
            order: 'DESC',
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
  }, [postDetailLoadingState, parentCommentIsDeleted]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollToCommentsPosition?.position === 'top') {
        dispatch(postActions.setScrollCommentsPosition(null));
      } else if (scrollToCommentsPosition?.position === 'bottom') {
        scrollToIndex();
      } else if (!!parentId && childrenComments?.length > 0) {
        const commentPosition = childrenComments?.findIndex?.(
          (item: ICommentData) => item.id == commentId,
        );
        if (commentPosition > 0) {
          scrollToIndex(commentPosition);
        }
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [scrollToCommentsPosition, childrenComments]);

  const scrollToIndex = (index?: number) => {
    try {
      listRef.current?.scrollToIndex?.({
        animated: true,
        index: !!index
          ? index
          : childrenComments?.length > 0
          ? childrenComments?.length - 1
          : 0,
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

  const onRefresh = () => {
    if (parentCommentIsDeleted) {
      setIsEmpty(true);
      dispatch(
        modalActions.showAlert({
          // @ts-ignore
          HeaderImageComponent: (
            <View style={{alignItems: 'center'}}>
              <SVGIcon
                // @ts-ignore
                source={CommentNotFoundImg}
                width={120}
                height={120}
                tintColor="none"
              />
            </View>
          ),
          title: t('post:deleted_comment:title'),
          titleProps: {style: {flex: 1, textAlign: 'center'}},
          showCloseButton: false,
          cancelBtn: false,
          isDismissible: true,
          onConfirm: () => {
            rootNavigation.goBack();
          },
          confirmLabel: t('post:deleted_comment:button_text'),
          content: t('post:deleted_comment:description'),
          contentProps: {style: {textAlign: 'center'}},
          ContentComponent: Text.BodyS,
          buttonViewStyle: {justifyContent: 'center'},
          headerStyle: {marginBottom: 0},
          onDismiss: () => {
            rootNavigation.goBack();
          },
        }),
      );
      setRefreshing(false);
    }
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

  if (isEmpty) {
    return null;
  }
  return (
    <View style={{flex: 1}}>
      <FlatList
        ref={listRef}
        testID="list"
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.borderDisable}
          />
        }
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
    (item: ICommentData) => item.id == parentCommentId,
  );
  console.log(parentCommentId, 'parentCommentPosition', parentCommentPosition);

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
