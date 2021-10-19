import {useBackHandler} from '@react-native-community/hooks';
import {useFocusEffect} from '@react-navigation/native';
import React, {
  useCallback,
  useContext,
  useEffect,
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

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import {AppContext} from '~/contexts/AppContext';
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
import {deviceDimensions} from '~/theme/dimension';
import {ITheme} from '~/theme/interfaces';
import {sortComments} from '../helper/PostUtils';
import {showHideToastMessage} from '~/store/modal/actions';
import {useBaseHook} from '~/hooks';

const PostDetail = (props: any) => {
  const [groupIds, setGroupIds] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  let countRetryScrollToBottom = useRef(0).current;
  const commentInputRef = useRef<any>();

  const params = props?.route?.params;
  const {post_id, focus_comment} = params || {};

  const textInputRef = useRef<any>();
  const listRef = useRef<any>();
  let layoutSetted = useRef(false).current;

  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const {rootNavigation} = useRootNavigation();
  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme;
  const windowDimension = useWindowDimensions();
  const isLaptop = windowDimension.width >= deviceDimensions.laptop;
  const styles = createStyle(theme, isLaptop);

  const userId = useUserIdAuth();
  const {streamClient} = useContext(AppContext);

  const id = post_id;
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
  useFocusEffect(() => {
    if (!user && Platform.OS === 'web') {
      rootNavigation.replace(rootSwitch.authStack);
    }
  });

  useEffect(() => {
    if (id && userId && streamClient) {
      getPostDetail((loading, success) => {
        if (!loading && !success) {
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
  }, [id, userId, streamClient]);

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
          title: i18n.t('common:label_discard_changes'),
          content: i18n.t('common:text_discard_warning'),
          showCloseButton: true,
          cancelBtn: true,
          cancelLabel: i18n.t('common:btn_continue_editing'),
          confirmLabel: i18n.t('common:btn_discard'),
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
      if (sectionIndex === -1) {
        sectionIndex = sectionData.length - 1;
      }
      if (itemIndex === -1) {
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
        scrollTo(-1, -1);
      }, 100);
    }
  };

  const onPressComment = () => {
    scrollTo(-1, -1);
    textInputRef.current?.focus?.();
  };

  const onCommentSuccess = useCallback(
    ({
      newCommentId,
      parentCommentId,
    }: {
      newCommentId: string;
      parentCommentId?: string;
    }) => {
      console.log(`\x1b[36m🐣️ index newCommentId: ${newCommentId}\x1b[0m`);
      console.log(
        `\x1b[36m🐣️ index parentCommentId: ${parentCommentId}\x1b[0m`,
      );
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

  const renderPostContent = () => {
    if (!id) {
      return null;
    }
    return (
      <>
        <PostView postId={id} isPostDetail onPressComment={onPressComment} />
        <Divider />
        {commentLeft > 0 && (
          <LoadMoreComment
            title={'post:text_load_more_comments'}
            postId={id}
            idLessThan={listComment?.[0]?.id}
          />
        )}
      </>
    );
  };

  const renderFooter = () => {
    return <View style={styles.footer} />;
  };

  const onLayout = useCallback(() => {
    if (!layoutSetted) {
      layoutSetted = true;
      if (focus_comment && listComment?.length > 0) {
        scrollTo(-1, -1);
      }
      if (focus_comment && Platform.OS === 'web') {
        textInputRef.current?.focus?.();
      }
    }
  }, [layoutSetted]);

  return (
    <ScreenWrapper isFullView backgroundColor={colors.placeholder}>
      <Header
        titleTextProps={{useI18n: true}}
        title={'post:title_post_detail'}
        onPressBack={onPressBack}
      />
      {!postTime ? (
        <PostViewPlaceholder />
      ) : (
        <View style={styles.container}>
          <View style={styles.postDetailContainer}>
            <SectionList
              ref={listRef}
              sections={sectionData}
              renderItem={renderCommentItem}
              renderSectionHeader={renderSectionHeader}
              ListHeaderComponent={renderPostContent}
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
    </ScreenWrapper>
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
  return result;
};

const createStyle = (theme: ITheme, isLaptop: boolean) => {
  const {colors, dimension, spacing} = theme;

  return StyleSheet.create({
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

export default PostDetail;
