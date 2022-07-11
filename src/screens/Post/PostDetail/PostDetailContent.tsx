import {useIsFocused} from '@react-navigation/native';
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  DeviceEventEmitter,
  RefreshControl,
  SectionList,
  StyleSheet,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Divider from '~/beinComponents/Divider';
import Header from '~/beinComponents/Header';
import CommentItem from '~/beinComponents/list/items/CommentItem';
import PostViewPlaceholder from '~/beinComponents/placeholder/PostViewPlaceholder';
import API_ERROR_CODE from '~/constants/apiErrorCode';
import {useBaseHook} from '~/hooks';
import {useUserIdAuth} from '~/hooks/auth';
import {useBackPressListener, useRootNavigation} from '~/hooks/navigation';
import {useKeySelector} from '~/hooks/selector';
import {IUserResponse} from '~/interfaces/IAuth';
import {
  IAudienceGroup,
  ICommentData,
  IPayloadGetPostDetail,
} from '~/interfaces/IPost';
import images from '~/resources/images';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import {rootSwitch} from '~/router/stack';
import CommentInputView from '~/screens/Post/components/CommentInputView';
import LoadMoreComment from '~/screens/Post/components/LoadMoreComment';
import PostView from '~/screens/Post/components/PostView';
import postActions from '~/screens/Post/redux/actions';
import postKeySelector from '~/screens/Post/redux/keySelector';
import Store from '~/store';
import modalActions from '~/store/modal/actions';
import {ITheme} from '~/theme/interfaces';
import SVGIcon from '~/beinComponents/Icon/SvgIcon';
import CommentNotFoundImg from '~/../assets/images/img_comment_not_found.svg';
import Text from '~/beinComponents/Text';
import {IPayloadPutMarkAsRead} from '~/interfaces/IPost';
import spacing from '~/theme/spacing';
const defaultList = [{title: '', type: 'empty', data: []}];

const _PostDetailContent = (props: any) => {
  const [groupIds, setGroupIds] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [loading, setLoading] = useState(false);

  let countRetryScrollToBottom = useRef(0).current;
  const commentInputRef = useRef<any>();
  const internetReachableRef = useRef(true);

  const params = props?.route?.params;
  const {post_id, focus_comment, noti_id = ''} = params || {};
  const postId = post_id;
  const listRef = useRef<any>();
  const layoutSet = useRef(false);

  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const {rootNavigation} = useRootNavigation();
  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = useMemo(() => createStyle(theme), [theme]);

  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');

  const userId = useUserIdAuth();

  const id = post_id;
  const actor = useKeySelector(postKeySelector.postActorById(id));
  const deleted = useKeySelector(postKeySelector.postDeletedById(id));
  const createdAt = useKeySelector(postKeySelector.postCreatedAtById(id));
  const audience = useKeySelector(postKeySelector.postAudienceById(id));
  const commentLeft = useKeySelector(
    postKeySelector.postCommentOnlyCountById(id),
  );
  const commentError = useKeySelector(postKeySelector.commentErrorCode);

  const commentList = useKeySelector(postKeySelector.postCommentListById(id));
  const scrollToLatestItem = useKeySelector(postKeySelector.scrollToLatestItem);

  const comments = useKeySelector(postKeySelector.commentsByParentId(id));
  const listComment = comments || commentList || [];
  const sectionData = getSectionData(listComment) || [];

  const user: IUserResponse | boolean = Store.getCurrentUser();
  const isFocused = useIsFocused();

  const headerTitle = actor?.fullname
    ? t('post:title_post_detail_of').replace('%NAME%', actor?.fullname)
    : t('post:title_post_detail');

  useEffect(() => {
    onPressMarkSeenPost();
    return () => {
      dispatch(postActions.setCreatePostInitAudiences());
      dispatch(postActions.setCommentErrorCode(false));
    };
  }, []);

  useEffect(() => {
    return () => {
      if (commentError === API_ERROR_CODE.POST.postDeleted) {
        dispatch(postActions.deletePostLocal(id));
      }
    };
  }, [commentError]);

  const onPressMarkSeenPost = () => {
    if (!loading) {
      setLoading(true);
      const payload: IPayloadPutMarkAsRead = {
        postId,
        callback: () => {
          setLoading(false);
        },
      };
      dispatch(postActions.putMarkSeenPost(payload));
    }
  };

  const onPressBack = () => {
    const newCommentInput = commentInputRef?.current?.getText?.() || '';
    const newCommentSelectedImage = commentInputRef?.current?.hasMedia?.();

    if (newCommentInput !== '' || newCommentSelectedImage) {
      dispatch(
        modalActions.showAlert({
          title: t('post:title_discard_comment'),
          content: t('post:text_discard_comment'),
          showCloseButton: true,
          cancelBtn: true,
          cancelLabel: t('post:btn_continue_comment'),
          confirmLabel: t('post:btn_discard_comment'),
          onConfirm: () => rootNavigation.goBack(),
        }),
      );
      return;
    }
    if (!rootNavigation.canGoBack) {
      rootNavigation.navigate(homeStack.newsfeed);
      return;
    }
    rootNavigation.goBack();
  };

  useBackPressListener(onPressBack);

  useEffect(() => {
    if (!user) {
      rootNavigation.replace(rootSwitch.authStack);
    }
  }, [isFocused, user]);

  useEffect(() => {
    internetReachableRef.current = isInternetReachable;
  }, [isInternetReachable]);

  useEffect(() => {
    if (id && userId && internetReachableRef.current) {
      getPostDetail((loading, success) => {
        if (!loading && !success && internetReachableRef.current) {
          // showNotice();
        }
      });
    }
  }, [id, userId, internetReachableRef]);

  useEffect(() => {
    if (audience?.groups?.length > 0) {
      const ids: any = [];
      audience.groups.map((g: IAudienceGroup) => ids.push(g?.id));
      setGroupIds(ids?.join?.(','));
    }
  }, [audience?.groups]);

  const showNotice = (isSetRefreshing?: boolean) => {
    isSetRefreshing && setRefreshing(true);
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
        title: t('post:deleted_post:title'),
        titleProps: {style: {flex: 1, textAlign: 'center'}},
        showCloseButton: false,
        cancelBtn: false,
        isDismissible: true,
        onConfirm: () => {
          rootNavigation.canGoBack && rootNavigation.goBack();
        },
        confirmLabel: t('post:deleted_post:button_text'),
        content: t('post:deleted_post:description'),
        contentProps: {style: {textAlign: 'center'}},
        ContentComponent: Text.BodyS,
        buttonViewStyle: {justifyContent: 'center'},
        headerStyle: {marginBottom: 0},
        onDismiss: () => {
          rootNavigation.canGoBack && rootNavigation.goBack();
        },
      }),
    );
    isSetRefreshing && setRefreshing(false);
  };

  useEffect(() => {
    if (deleted) {
      if (!!noti_id) {
        rootNavigation.goBack();
      } else showNotice();
    }
  }, [deleted]);

  useEffect(() => {
    if (scrollToLatestItem) {
      onCommentSuccess(scrollToLatestItem);
      dispatch(postActions.setScrollToLatestItem(null));
    }
  }, [scrollToLatestItem]);

  const getPostDetail = (
    callbackLoading?: (loading: boolean, success: boolean) => void,
  ) => {
    if (userId && id) {
      const payload: IPayloadGetPostDetail = {
        postId: id,
        callbackLoading,
        showToast: !!noti_id,
      };
      dispatch(postActions.getPostDetail(payload));
    }
  };

  const onRefresh = () => {
    if (
      commentError === API_ERROR_CODE.POST.postDeleted ||
      commentError === API_ERROR_CODE.POST.postPrivacy
    ) {
      showNotice(true);
      return;
    } else {
      getPostDetail(loading => setRefreshing(loading));
    }
  };

  const scrollTo = (sectionIndex = 0, itemIndex = 0) => {
    if (sectionData.length > 0) {
      if (sectionIndex > sectionData.length - 1 || sectionIndex === -1) {
        sectionIndex = sectionData.length - 1;
      }
      if (
        itemIndex > sectionData?.[sectionIndex]?.data?.length ||
        itemIndex === -1
      ) {
        itemIndex = sectionData?.[sectionIndex]?.data?.length || 0;
      }

      try {
        listRef?.current?.scrollToLocation?.({
          itemIndex: itemIndex,
          sectionIndex: sectionIndex,
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
    countRetryScrollToBottom = countRetryScrollToBottom + 1;
    if (countRetryScrollToBottom < 20) {
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

  const onCommentSuccess = useCallback(
    ({parentCommentId}: {newCommentId: string; parentCommentId?: string}) => {
      let sectionIndex;
      let itemIndex = 0;
      if (parentCommentId) {
        sectionData?.map?.((section, index) => {
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

  const onPressReplySectionHeader = useCallback(
    commentData => {
      navigateToCommentDetailScreen(commentData, commentData);
    },
    [sectionData],
  );

  const onPressLoadMoreCommentLevel2 = useCallback(
    (commentData: any) => {
      navigateToCommentDetailScreen(commentData);
    },
    [sectionData],
  );

  const renderSectionHeader = (sectionData: any) => {
    const {section} = sectionData || {};
    const {comment, index} = section || {};

    if (sectionData?.section?.type === 'empty') {
      return <View />;
    }

    return (
      <CommentItem
        postId={id}
        commentData={comment}
        groupIds={groupIds}
        index={index}
        isNotReplyingComment
        onPressReply={onPressReplySectionHeader}
        onPressLoadMore={onPressLoadMoreCommentLevel2}
      />
    );
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

  const renderCommentItem = (data: any) => {
    const {item, index, section} = data || {};
    return (
      <CommentItem
        postId={id}
        commentData={item}
        commentParent={section?.comment}
        groupIds={groupIds}
        index={index}
        section={section}
        isNotReplyingComment
        onPressReply={onPressReplyCommentItem}
      />
    );
  };

  const renderFooter = () => {
    return <View style={styles.footer} />;
  };

  const onLayout = useCallback(() => {
    if (!layoutSet.current) {
      layoutSet.current = true;
      if (focus_comment && listComment?.length > 0) {
        //limit section index to default comment length = 10 to avoid scroll crash. it happen when init with large amount of comment, then scroll, then reload, result only 10 latest comment, scroll to out of index
        const sectionIndex = Math.min(9, sectionData.length - 1);
        scrollTo(sectionIndex, -1);
      }
      if (focus_comment) {
        commentInputRef.current?.focus?.();
      }
    }
  }, [layoutSet, sectionData.length, focus_comment, listComment?.length]);

  const onscroll = () => {
    DeviceEventEmitter.emit('stopAllVideo');
  };

  const renderContent = () => {
    if (!createdAt) return <PostViewPlaceholder />;

    if (isEmpty) return null;

    return (
      <View style={styles.container}>
        <View style={styles.postDetailContainer}>
          <SectionList
            ref={listRef}
            sections={deleted ? defaultList : sectionData}
            renderItem={renderCommentItem}
            renderSectionHeader={renderSectionHeader}
            ListHeaderComponent={
              <PostDetailContentHeader
                id={id}
                commentLeft={commentLeft}
                onPressComment={onPressComment}
                onContentLayout={props?.onContentLayout}
                idLessThan={listComment?.[0]?.id}
              />
            }
            ListFooterComponent={commentLeft && renderFooter}
            stickySectionHeadersEnabled={false}
            ItemSeparatorComponent={() => <View />}
            keyboardShouldPersistTaps={'handled'}
            onLayout={onLayout}
            onContentSizeChange={onLayout}
            onScroll={onscroll}
            onScrollToIndexFailed={onScrollToIndexFailed}
            refreshControl={
              <RefreshControl
                testID={'post_detail_content.refresh_control'}
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.borderDisable}
              />
            }
          />

          <CommentInputView
            commentInputRef={commentInputRef}
            postId={id}
            groupIds={groupIds}
            autoFocus={!!focus_comment}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.flex1}>
      <Header
        title={headerTitle}
        onPressBack={onPressBack}
        avatar={images.logo_bein}
      />
      {renderContent()}
    </View>
  );
};

const PostDetailContentHeader = ({
  id,
  onPressComment,
  onContentLayout,
  commentLeft,
  idLessThan,
}: any) => {
  if (!id) {
    return null;
  }
  return (
    <>
      <PostView
        postId={id}
        onPressComment={onPressComment}
        onContentLayout={onContentLayout}
        isPostDetail
        btnReactTestID="post_detail_content.btn_react"
        btnCommentTestID="post_detail_content.btn_comment"
      />
      <Divider />
      {commentLeft && (
        <LoadMoreComment
          title={'post:text_load_more_comments'}
          postId={id}
          idLessThan={idLessThan}
        />
      )}
    </>
  );
};

const getSectionData = (listComment: ICommentData[]) => {
  const result: any[] = [];
  listComment?.map?.((comment, index) => {
    const item: any = {};
    const lastChildComment = comment?.child?.list || [];
    const _data =
      lastChildComment.length > 0
        ? [lastChildComment[lastChildComment.length - 1]]
        : [];
    item.comment = comment;
    item.index = index;
    item.data = _data;
    result.push(item);
  });
  // long post without comment cant scroll to bottom
  // so need default list with an empty item to trigger scroll
  return result?.length > 0 ? result : defaultList;
};

const createStyle = (theme: ITheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    flex1: {
      flex: 1,
    },
    refreshing: {
      padding: spacing.padding.base,
    },
    container: {
      flex: 1,
    },
    postDetailContainer: {
      flex: 1,
    },
    footer: {height: spacing.margin.base, backgroundColor: colors.background},
  });
};

const PostDetailContent = memo(_PostDetailContent);
PostDetailContent.whyDidYouRender = true;
export default PostDetailContent;
