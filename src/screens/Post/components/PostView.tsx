import React, {FC, memo} from 'react';
import {
  View,
  StyleSheet,
  Keyboard,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {ITheme} from '~/theme/interfaces';
import {
  IAudienceUser,
  IOwnReaction,
  IPayloadReactToPost,
  IPostActivity,
  IPostAudience,
  IPostSetting,
  IReactionCounts,
} from '~/interfaces/IPost';
import Image from '~/beinComponents/Image';
import Text from '~/beinComponents/Text';
import resourceImages from '~/resources/images';
import {useBaseHook} from '~/hooks';
import {useUserIdAuth} from '~/hooks/auth';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import {formatLargeNumber} from '~/utils/formatData';
import ReactionView from '~/beinComponents/ReactionView';
import {useKeySelector} from '~/hooks/selector';
import postKeySelector from '~/screens/Post/redux/keySelector';
import postActions from '~/screens/Post/redux/actions';
import {ReactionType} from '~/constants/reactions';
import modalActions from '~/store/modal/actions';
import {IPayloadReactionDetailBottomSheet} from '~/interfaces/IModal';
import PostViewContent from '~/screens/Post/components/postView/PostViewContent';
import PostViewHeader from '~/screens/Post/components/postView/PostViewHeader';
import PostViewImportant from '~/screens/Post/components/postView/PostViewImportant';
import PostViewFooter from '~/screens/Post/components/postView/PostViewFooter';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import {useRootNavigation} from '~/hooks/navigation';
import PostViewMenu from '~/screens/Post/components/PostViewMenu';
import {isEqual} from 'lodash';
import PostViewFooterLite from '~/screens/Post/components/postView/PostViewFooterLite';
import ButtonMarkAsRead from '~/screens/Post/components/ButtonMarkAsRead';

export interface PostViewProps {
  style?: any;
  testID?: string;
  postId: number;
  isPostDetail?: boolean;
  onPressComment?: (postId: number) => void;
  onPressHeader?: (postId: number) => void;
  onContentLayout?: () => void;
  onPress?: () => void;
  pressNavigateToDetail?: boolean;
  isLite?: boolean;
  postData?: IPostActivity;
  isUseReduxState?: boolean;
  btnReactTestID?: string;
  btnCommentTestID?: string;
}

const _PostView: FC<PostViewProps> = ({
  style,
  testID = 'post_view',
  postId,
  isPostDetail = false,
  onPressComment,
  onPressHeader,
  onContentLayout,
  onPress,
  pressNavigateToDetail,
  isLite,
  postData,
  isUseReduxState = true,
  btnReactTestID,
  btnCommentTestID,
}: PostViewProps) => {
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const {t} = useBaseHook();
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyle(theme);

  let actor: IAudienceUser | undefined,
    audience: IPostAudience | undefined,
    deleted: boolean,
    markedReadPost: boolean,
    ownerReactions: IOwnReaction,
    reactionsCount: IReactionCounts,
    isDraft: boolean,
    createdAt: string | undefined,
    media: any,
    content: string,
    highlight: string,
    setting: IPostSetting,
    commentsCount: number;

  if (isUseReduxState) {
    actor = useKeySelector(postKeySelector.postActorById(postId));
    audience = useKeySelector(postKeySelector.postAudienceById(postId));
    isDraft = useKeySelector(postKeySelector.postIsDraftById(postId));
    createdAt = useKeySelector(postKeySelector.postCreatedAtById(postId));
    media = useKeySelector(postKeySelector.postMediaById(postId));
    content = useKeySelector(postKeySelector.postContentById(postId));
    highlight = useKeySelector(postKeySelector.postHighlightById(postId));
    setting = useKeySelector(postKeySelector.postSettingById(postId));
    deleted = useKeySelector(postKeySelector.postDeletedById(postId));
    markedReadPost = useKeySelector(postKeySelector.postMarkedReadById(postId));
    commentsCount = useKeySelector(
      postKeySelector.postCommentsCountById(postId),
    );

    ownerReactions = useKeySelector(
      postKeySelector.postOwnerReactionById(postId),
    );
    reactionsCount = useKeySelector(
      postKeySelector.postReactionCountsById(postId),
    );
  } else {
    actor = postData?.actor;
    audience = postData?.audience;
    isDraft = postData?.isDraft || false;
    createdAt = postData?.createdAt || '';
    media = postData?.media;
    content = postData?.content || '';
    highlight = postData?.highlight || '';
    setting = postData?.setting || {};
    markedReadPost = postData?.markedReadPost || false;
    deleted = false;
    commentsCount = postData?.commentsCount || 0;
    ownerReactions = postData?.ownerReactions || [];
    reactionsCount = postData?.reactionsCount || {};
  }

  const {images, videos} = media || {};
  const {isImportant, importantExpiredAt} = setting || {};

  const userId = useUserIdAuth();

  const commentCount = formatLargeNumber(commentsCount);
  const labelButtonComment = `${t('post:button_comment')}${
    commentCount ? ` (${commentCount})` : ''
  }`;

  const onPressShowAudiences = () => {
    const payload = {postId, fromStack: 'somewhere'};
    dispatch(postActions.showPostAudiencesBottomSheet(payload));
  };

  const onPressMenu = (event: any) => {
    Keyboard.dismiss();
    dispatch(
      modalActions.showModal({
        isOpen: true,
        ContentComponent: (
          <PostViewMenu
            postId={postId}
            isPostDetail={isPostDetail}
            isActor={actor?.id == userId}
            isDraftPost={isDraft}
          />
        ),
        props: {
          webModalStyle: {minHeight: undefined},
          isContextMenu: true,
          position: {x: event?.pageX, y: event?.pageY},
        },
      }),
    );
  };

  const onAddReaction = (reactionId: ReactionType) => {
    const payload: IPayloadReactToPost = {
      id: postId,
      reactionId: reactionId,
      ownReaction: ownerReactions,
      reactionCounts: reactionsCount,
    };
    dispatch(postActions.postReactToPost(payload));
  };

  const onRemoveReaction = (reactionId: ReactionType) => {
    const payload: IPayloadReactToPost = {
      id: postId,
      reactionId: reactionId,
      ownReaction: ownerReactions,
      reactionCounts: reactionsCount,
    };
    dispatch(postActions.deleteReactToPost(payload));
  };

  const getReactionStatistics = async (param: any) => {
    try {
      const response = await postDataHelper.getReactionDetail(param);
      const data = await response?.list;
      const users = (data || []).map((item: any) => ({
        id: item?.actor?.id,
        avatar: item?.actor?.avatar,
        fullname: item?.actor?.fullname,
      }));

      return Promise.resolve(users || []);
    } catch (err) {
      return Promise.reject();
    }
  };

  const onLongPressReaction = (reactionType: ReactionType) => {
    console.log(`\x1b[36m🐣️ PostView onLongPressReaction\x1b[0m`);
    const payload: IPayloadReactionDetailBottomSheet = {
      isOpen: true,
      reactionCounts: reactionsCount,
      initReaction: reactionType,
      getDataParam: {target: 'POST', targetId: postId},
      getDataPromise: getReactionStatistics,
    };
    dispatch(modalActions.showReactionDetailBottomSheet(payload));
  };

  const _onPressHeader = () => {
    if (onPressHeader) {
      onPressHeader?.(postId);
    } else {
      rootNavigation.navigate(homeStack.postDetail, {post_id: postId});
    }
  };

  const _onPressComment = () => {
    if (onPressComment) {
      onPressComment?.(postId);
    } else {
      rootNavigation.navigate(homeStack.postDetail, {
        post_id: postId,
        focus_comment: true,
      });
    }
  };

  const _onPress = () => {
    if (pressNavigateToDetail) {
      rootNavigation.navigate(homeStack.postDetail, {post_id: postId});
    } else {
      onPress?.();
    }
  };

  if (deleted) {
    return (
      <View style={StyleSheet.flatten([styles.deletedContainer, style])}>
        <Image style={styles.imageDelete} source={resourceImages.img_delete} />
        <Text.H6 testID={'post_view.label_deleted'} useI18n>
          post:label_post_deleted
        </Text.H6>
      </View>
    );
  }

  return (
    <TouchableOpacity
      testID={testID}
      activeOpacity={0.8}
      disabled={!onPress && !pressNavigateToDetail}
      onPress={_onPress}
      style={StyleSheet.flatten([
        Platform.OS === 'web' && !isPostDetail ? styles.rootOnWeb : {},
        style,
      ])}>
      <PostViewImportant
        isLite={isLite}
        isImportant={!!isImportant}
        expireTime={importantExpiredAt}
        markedReadPost={markedReadPost}
      />
      <View style={[styles.container]}>
        <PostViewHeader
          audience={audience}
          actor={actor}
          time={createdAt}
          onPressHeader={_onPressHeader}
          onPressMenu={onPressMenu}
          onPressShowAudiences={onPressShowAudiences}
        />
        <PostViewContent
          postId={postId}
          isLite={isLite}
          content={isLite && highlight ? highlight : content}
          images={images}
          videos={videos}
          isPostDetail={isPostDetail}
          onContentLayout={onContentLayout}
        />
        {!isLite && (
          <ReactionView
            style={styles.reactions}
            ownerReactions={ownerReactions}
            reactionsCount={reactionsCount}
            onAddReaction={onAddReaction}
            onRemoveReaction={onRemoveReaction}
            onLongPressReaction={onLongPressReaction}
          />
        )}
        {isLite ? (
          <PostViewFooterLite commentsCount={commentsCount} />
        ) : (
          <PostViewFooter
            labelButtonComment={labelButtonComment}
            onAddReaction={onAddReaction}
            onPressComment={_onPressComment}
            btnReactTestID={btnReactTestID}
            btnCommentTestID={btnCommentTestID}
            reactionCounts={reactionsCount}
          />
        )}
        {!isLite && (
          <ButtonMarkAsRead
            postId={postId}
            markedReadPost={markedReadPost}
            isImportant={isImportant}
            expireTime={importantExpiredAt}
            isActor={actor?.id == userId}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing, dimension} = theme;
  return StyleSheet.create({
    rowCenter: {flexDirection: 'row', alignItems: 'center'},
    rootOnWeb: {
      alignSelf: 'center',
      overflow: 'hidden',
      width: '100%',
      maxWidth: Platform.OS === 'web' ? dimension.maxNewsfeedWidth : undefined,
      borderRadius: 6,
      shadowOffset: {width: 0, height: 1},
      shadowColor: '#120F22',
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    container: {
      backgroundColor: colors.background,
    },
    reactions: {
      paddingHorizontal: spacing.padding.base,
    },
    deletedContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.padding.large,
      backgroundColor: colors.background,
    },
    imageDelete: {width: 35, height: 35, marginRight: spacing.margin.large},
  });
};

function propsAreEqual(prev: any, next: any) {
  return isEqual(prev, next);
}

const PostView = memo(_PostView, propsAreEqual);
PostView.whyDidYouRender = true;
export default PostView;
