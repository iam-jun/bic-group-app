import {useBackHandler} from '@react-native-community/hooks';
import {useIsFocused} from '@react-navigation/native';
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Platform,
  RefreshControl,
  SectionList,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import Divider from '~/beinComponents/Divider';
import Header from '~/beinComponents/Header';
import CommentItem from '~/beinComponents/list/items/CommentItem';
import PostViewPlaceholder from '~/beinComponents/placeholder/PostViewPlaceholder';

import {AppContext} from '~/contexts/AppContext';
import {useBaseHook} from '~/hooks';
import {useUserIdAuth} from '~/hooks/auth';
import {useRootNavigation} from '~/hooks/navigation';
import {useKeySelector} from '~/hooks/selector';
import {IUserResponse} from '~/interfaces/IAuth';

import {
  IAudienceGroup,
  IPayloadGetPostDetail,
  IReaction,
} from '~/interfaces/IPost';
import i18n from '~/localization';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import {rootSwitch} from '~/router/stack';
import CommentInputView from '~/screens/Post/components/CommentInputView';
import LoadMoreComment from '~/screens/Post/components/LoadMoreComment';
import PostView from '~/screens/Post/components/PostView';
import postActions from '~/screens/Post/redux/actions';
import postKeySelector from '~/screens/Post/redux/keySelector';
import Store from '~/store';
import * as modalActions from '~/store/modal/actions';
import {showHideToastMessage} from '~/store/modal/actions';
import {deviceDimensions} from '~/theme/dimension';
import {ITheme} from '~/theme/interfaces';
import {sortComments} from '../helper/PostUtils';

const defaultList = [{title: '', type: 'empty', data: []}];

const _PostDetailContent = (props: any) => {
  const [groupIds, setGroupIds] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  let countRetryScrollToBottom = useRef(0).current;
  const commentInputRef = useRef<any>();
  const internetReachableRef = useRef(true);

  const params = props?.route?.params;
  const {post_id, focus_comment} = params || {};

  const textInputRef = useRef<any>();
  const listRef = useRef<any>();
  const layoutSet = useRef(false);

  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const {rootNavigation} = useRootNavigation();
  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme;
  const windowDimension = useWindowDimensions();
  const isLaptop = windowDimension.width >= deviceDimensions.laptop;
  const styles = useMemo(() => createStyle(theme, isLaptop), [theme, isLaptop]);

  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');

  const userId = useUserIdAuth();
  const {streamClient} = useContext(AppContext);

  const id = post_id;
  const actor = useKeySelector(postKeySelector.postActorById(id));
  const deleted = useKeySelector(postKeySelector.postDeletedById(id));
  const postTime = useKeySelector(postKeySelector.postTimeById(id));
  const audience = useKeySelector(postKeySelector.postAudienceById(id));
  const latest_reactions = useKeySelector(
    postKeySelector.postLatestReactionsComments(id),
  );
  const commentCount = useKeySelector(
    postKeySelector.postCommentCountsById(id),
  );

  const comments = useKeySelector(postKeySelector.commentsByParentId(id));
  const listComment = comments || sortComments(latest_reactions) || [];
  const sectionData = getSectionData(listComment) || [];

  const commentLeft = commentCount - listComment.length;

  const user: IUserResponse | boolean = Store.getCurrentUser();
  const isFocused = useIsFocused();

  const headerTitle = actor?.data?.fullname
    ? t('post:title_post_detail_of').replace('%NAME%', actor?.data?.fullname)
    : t('post:title_post_detail');

  useEffect(() => {
    if (!user && Platform.OS === 'web') {
      rootNavigation.replace(rootSwitch.authStack);
    }
  }, [isFocused, user]);

  useEffect(() => {
    internetReachableRef.current = isInternetReachable;
  }, [isInternetReachable]);

  useEffect(() => {
    if (id && userId && streamClient && internetReachableRef.current) {
      getPostDetail((loading, success) => {
        if (!loading && !success && internetReachableRef.current) {
          if (Platform.OS === 'web') {
            rootNavigation.replace(rootSwitch.notFound);
          } else {
            rootNavigation.canGoBack && rootNavigation.goBack();
            dispatch(
              showHideToastMessage({
                content: t('post:error_post_detail_deleted'),
                props: {
                  textProps: {useI18n: true},
                  type: 'error',
                },
              }),
            );
          }
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

  useEffect(() => {
    if (deleted) {
      rootNavigation.goBack();
    }
  }, [deleted]);

  const getPostDetail = (
    callbackLoading?: (loading: boolean, success: boolean) => void,
  ) => {
    if (userId && id && streamClient) {
      const payload: IPayloadGetPostDetail = {
        userId,
        postId: id,
        streamClient,
        callbackLoading,
      };
      dispatch(postActions.getPostDetail(payload));
    }
  };

  const onRefresh = () => getPostDetail(loading => setRefreshing(loading));

  const onPressBack = () => {
    const newCommentInput = commentInputRef?.current?.getText?.() || '';
    const newCommentSelectedImage =
      commentInputRef?.current?.getSelectedImage?.();
    if (newCommentInput !== '' || newCommentSelectedImage) {
      dispatch(
        modalActions.showAlert({
          title: i18n.t('post:title_discard_comment'),
          content: i18n.t('post:text_discard_comment'),
          showCloseButton: true,
          cancelBtn: true,
          cancelLabel: i18n.t('post:btn_continue_comment'),
          confirmLabel: i18n.t('post:btn_discard_comment'),
          onConfirm: () => rootNavigation.goBack(),
          stretchOnWeb: true,
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

  useBackHandler(() => {
    onPressBack();
    return true;
  });

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

      listRef?.current?.scrollToLocation?.({
        itemIndex: itemIndex,
        sectionIndex: sectionIndex,
        animated: true,
      });
    }
  };

  const onScrollToIndexFailed = () => {
    countRetryScrollToBottom = countRetryScrollToBottom + 1;
    if (countRetryScrollToBottom < 20) {
      setTimeout(() => {
        scrollTo(Math.min(9, sectionData.length - 1), -1);
      }, 100);
    }
  };

  const onPressComment = useCallback(() => {
    scrollTo(-1, -1);
    textInputRef.current?.focus?.();
  }, [textInputRef.current, sectionData.length]);

  const onCommentSuccess = useCallback(
    ({
      newCommentId,
      parentCommentId,
    }: {
      newCommentId: string;
      parentCommentId?: string;
    }) => {
      let sectionIndex;
      let itemIndex = 0;
      if (parentCommentId) {
        sectionData?.map?.((section, index) => {
          if (section?.comment?.id === parentCommentId) {
            sectionIndex = index;
            itemIndex = (section?.data?.length || 0) + 1;
          }
        });
      } else {
        sectionIndex = sectionData.length - 1;
      }
      scrollTo(sectionIndex, itemIndex);
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
        onPressReply={() => {
          textInputRef.current?.focus?.();
          scrollTo(index, 0);
        }}
      />
    );
  };

  const renderCommentItem = (data: any) => {
    const {item, index, section} = data || {};
    return (
      <CommentItem
        postId={id}
        commentData={item}
        commentParent={section?.comment}
        groupIds={groupIds}
        onPressReply={() => {
          textInputRef.current?.focus?.();
          scrollTo(section?.index, index + 1);
        }}
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
      if (focus_comment && Platform.OS === 'web') {
        textInputRef.current?.focus?.();
      }
    }
  }, [layoutSet, sectionData.length, focus_comment, listComment?.length]);

  return (
    <View style={styles.flex1}>
      <Header title={headerTitle} onPressBack={onPressBack} />
      {!postTime ? (
        <PostViewPlaceholder />
      ) : (
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
              ListFooterComponent={commentCount && renderFooter}
              stickySectionHeadersEnabled={false}
              ItemSeparatorComponent={() => <View />}
              keyboardShouldPersistTaps={'handled'}
              onLayout={onLayout}
              onContentSizeChange={onLayout}
              onScrollToIndexFailed={onScrollToIndexFailed}
              refreshControl={
                <RefreshControl
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
              textInputRef={textInputRef}
              onCommentSuccess={onCommentSuccess}
            />
          </View>
        </View>
      )}
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
      {commentLeft > 0 && (
        <LoadMoreComment
          title={'post:text_load_more_comments'}
          postId={id}
          idLessThan={idLessThan}
        />
      )}
    </>
  );
};

const getSectionData = (listComment: IReaction[]) => {
  const result: any[] = [];
  listComment?.map?.((comment, index) => {
    const item: any = {};
    item.comment = comment;
    item.index = index;
    item.data = comment?.latest_children?.comment || [];
    result.push(item);
  });
  // long post without comment cant scroll to bottom
  // so need default list with an empty item to trigger scroll
  return result?.length > 0 ? result : defaultList;
};

const createStyle = (theme: ITheme, isLaptop: boolean): any => {
  const {colors, dimension, spacing} = theme;
  return StyleSheet.create({
    flex1: {flex: 1},
    container: {
      flex: 1,
      ...Platform.select({
        web: {
          backgroundColor: colors.surface,
          alignItems: 'center',
        },
      }),
    },
    postDetailContainer: {
      flex: 1,
      ...Platform.select({
        web: {
          width: '100%',
          maxWidth: dimension.maxNewsfeedWidth,
          marginTop: isLaptop ? spacing.margin.base : 0,
          overflow: 'hidden',
          borderTopLeftRadius: isLaptop ? 6 : 0,
          borderTopRightRadius: isLaptop ? 6 : 0,
        },
      }),
    },
    footer: {height: spacing.margin.base, backgroundColor: colors.background},
  });
};

const PostDetailContent = memo(_PostDetailContent);
PostDetailContent.whyDidYouRender = true;
export default PostDetailContent;
