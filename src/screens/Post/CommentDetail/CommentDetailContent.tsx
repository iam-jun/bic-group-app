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
import API_ERROR_CODE from '~/constants/apiErrorCode';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import LoadMoreComment from '../components/LoadMoreComment';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import homeActions from '~/screens/Home/redux/actions';

const CommentDetailContent = (props: any) => {
  const [groupIds, setGroupIds] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isScrollFirst, setIsScrollFirst] = useState(false);

  const theme = useTheme() as ITheme;

  const {t} = useBaseHook();
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();

  const listRef = useRef<any>();
  const commentInputRef = useRef<any>();

  const params = props?.route?.params;
  const {postId, replyItem, commentParent, commentId, parentId} = params || {};
  const id = postId;

  const actor = useKeySelector(postKeySelector.postActorById(id));
  const audience = useKeySelector(postKeySelector.postAudienceById(id));
  const postDetailLoadingState = useKeySelector(
    postKeySelector.loadingGetPostDetail,
  );
  const comments = useKeySelector(postKeySelector.commentsByParentId(id));
  const {
    childrenComments = [],
    newCommentData,
    viewMore = false,
    notFoundComment,
  } = getListChildComment(comments, !!parentId ? parentId : commentId);

  const scrollToCommentsPosition = useKeySelector(
    postKeySelector.scrollToCommentsPosition,
  );

  const copyCommentError = useKeySelector(postKeySelector.commentErrorCode);

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
    if (copyCommentError === API_ERROR_CODE.POST.postPrivacy) {
      props?.showPrivacy?.(true);
    } else if (
      copyCommentError === API_ERROR_CODE.POST.copiedCommentIsDeleted
    ) {
      setIsEmpty(true);
      dispatch(
        modalActions.showHideToastMessage({
          content: 'post:text_comment_was_deleted',
          props: {
            type: 'error',
            textProps: {useI18n: true},
          },
          toastType: 'normal',
        }),
      );
      rootNavigation.replace(homeStack.postDetail, {post_id: postId});
    }
    if (!postDetailLoadingState && !copyCommentError) {
      dispatch(postActions.setScrollCommentsPosition(null));
      dispatch(
        postActions.getCommentDetail({
          commentId,
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
        }),
      );
    }
  }, [postDetailLoadingState, copyCommentError]);

  useEffect(() => {
    if (
      !loading &&
      (notFoundComment === undefined || notFoundComment < 0) &&
      !isEmpty &&
      !copyCommentError
    ) {
      dispatch(
        modalActions.showHideToastMessage({
          content: 'error:not_found_desc',
          props: {
            type: 'error',
            textProps: {useI18n: true},
          },
          toastType: 'normal',
        }),
      );
      rootNavigation.replace(homeStack.newsfeed);
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
        title: t(`post:${type}:title`),
        titleProps: {style: {flex: 1, textAlign: 'center'}},
        showCloseButton: false,
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
        contentProps: {style: {textAlign: 'center'}},
        ContentComponent: Text.BodyS,
        buttonViewStyle: {justifyContent: 'center'},
        headerStyle: {marginBottom: 0},
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
    if (copyCommentError === API_ERROR_CODE.POST.commentDeleted) {
      setIsEmpty(true);
      setRefreshing(true);
      showNotice();
      setRefreshing(false);
      return;
    } else if (copyCommentError === API_ERROR_CODE.POST.postDeleted) {
      setIsEmpty(true);
      setRefreshing(true);
      showNotice('deleted_post');
      setRefreshing(false);
      return;
    }
    dispatch(
      postActions.getCommentDetail({
        commentId: !!parentId ? parentId : commentId,
        callbackLoading: (_loading: boolean) => {
          setRefreshing(_loading);
        },
      }),
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
    if (viewMore) {
      const commentLength = newCommentData?.child?.list?.length || 0;
      const lastItem = newCommentData?.child?.list?.[commentLength - 1];
      const _parentId = !!parentId ? parentId : commentId;
      return (
        <LoadMoreComment
          title={'post:text_load_more_replies'}
          postId={id}
          idGreaterThan={lastItem?.id}
          commentId={_parentId}
        />
      );
    } else return <ViewSpacing height={12} />;
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
            onPress={goToPostDetail}
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
        viewMore={viewMore}
        defaultReplyTargetId={newCommentData?.id}
      />
    </View>
  );
};

const CommentLevel1 = ({
  id,
  headerTitle,
  commentData,
  groupIds,
  onPress,
}: any) => {
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
          <Text.BodyM
            onPress={onPress}
            suppressHighlighting
            style={styles.highlightText}>
            {headerTitle}
          </Text.BodyM>
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

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      paddingLeft: spacing.padding.large,
      paddingVertical: spacing.padding.small,
      flexDirection: 'row',
    },
    highlightText: {
      color: colors.link,
    },
    headerText: {
      fontSize: 14,
    },
    footer: {
      backgroundColor: colors.background,
      paddingHorizontal: spacing.padding.large,
      paddingBottom: spacing.padding.extraLarge,
      paddingTop: spacing.padding.large,
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
  });
};

export default CommentDetailContent;
