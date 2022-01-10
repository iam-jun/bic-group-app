import React, {FC, useEffect, useState, memo} from 'react';
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
  IActivityImportant,
  IAudienceUser,
  IPayloadReactToPost,
  IPostActivity,
  IPostAudience,
} from '~/interfaces/IPost';
import {IObject} from '~/interfaces/common';
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
import modalActions, {
  showReactionDetailBottomSheet,
} from '~/store/modal/actions';
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

export interface PostViewProps {
  style?: any;
  testID?: string;
  postId: string;
  isPostDetail?: boolean;
  onPressComment?: (postId: string) => void;
  onPressHeader?: (postId: string) => void;
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
  testID,
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
  const [isImportant, setIsImportant] = useState(false);

  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const {t} = useBaseHook();
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyle(theme);

  let actor: IAudienceUser | undefined,
    audience: IPostAudience | undefined,
    time: string | undefined,
    important: IActivityImportant | undefined,
    deleted: boolean,
    own_reactions: any,
    reaction_counts: IObject<number>,
    postObjectData: any;

  if (isUseReduxState) {
    actor = useKeySelector(postKeySelector.postActorById(postId));
    audience = useKeySelector(postKeySelector.postAudienceById(postId));
    time = useKeySelector(postKeySelector.postTimeById(postId));
    important = useKeySelector(postKeySelector.postImportantById(postId));
    deleted = useKeySelector(postKeySelector.postDeletedById(postId));
    own_reactions = useKeySelector(postKeySelector.postOwnReactionById(postId));
    reaction_counts = useKeySelector(
      postKeySelector.postReactionCountsById(postId),
    );
    postObjectData = useKeySelector(postKeySelector.postObjectDataById(postId));
  } else {
    actor = postData?.actor;
    audience = postData?.audience;
    time = postData?.time;
    important = postData?.important;
    deleted = false;
    own_reactions = postData?.own_reactions;
    reaction_counts = postData?.reaction_counts || {};
    postObjectData = postData?.object?.data;
  }

  const {content, images, highlight} = postObjectData || {};

  const userId = useUserIdAuth();

  const commentCount = formatLargeNumber(reaction_counts?.comment_count || 0);
  const labelButtonComment = `${t('post:button_comment')}${
    commentCount ? ` (${commentCount})` : ''
  }`;

  /**
   * Check Important
   * - important active = true
   * - important expiresTime > now
   * - Not mark as read
   * - Not called mark as read
   */
  const checkImportant = () => {
    const {active = false} = important || {};
    let notMarkAsRead = true;
    if (own_reactions?.mark_as_read?.length > 0) {
      notMarkAsRead = false;
    }
    setIsImportant(!!active && notMarkAsRead);
  };

  useEffect(() => {
    if (important && important.active) {
      checkImportant();
    }
  }, [important]);

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
      ownReaction: own_reactions,
      reactionCounts: reaction_counts,
      userId: userId,
    };
    dispatch(postActions.postReactToPost(payload));
  };

  const onRemoveReaction = (reactionId: ReactionType) => {
    const payload: IPayloadReactToPost = {
      id: postId,
      reactionId: reactionId,
      ownReaction: own_reactions,
      reactionCounts: reaction_counts,
      userId: userId,
    };
    dispatch(postActions.deleteReactToPost(payload));
  };

  const getReactionStatistics = async (param: any) => {
    try {
      const response = await postDataHelper.getReactionDetail(param);
      const data = await response?.results;
      const users = data.map((item: any) => ({
        id: item?.user?.id,
        avatar: item?.user?.data?.avatar,
        fullname: item?.user?.data?.fullname,
      }));

      return Promise.resolve(users || []);
    } catch (err) {
      return Promise.reject();
    }
  };

  const onLongPressReaction = (reactionType: ReactionType) => {
    const payload: IPayloadReactionDetailBottomSheet = {
      isOpen: true,
      reactionCounts: reaction_counts,
      initReaction: reactionType,
      getDataParam: {postId, commentId: undefined},
      getDataPromise: getReactionStatistics,
    };
    dispatch(showReactionDetailBottomSheet(payload));
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
        <Text.H6 useI18n>post:label_post_deleted</Text.H6>
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
        isImportant={isImportant}
        expireTime={important?.expiresTime}
      />
      <View style={[styles.container]}>
        <PostViewHeader
          audience={audience}
          actor={actor}
          time={time}
          onPressHeader={_onPressHeader}
          onPressMenu={onPressMenu}
          onPressShowAudiences={onPressShowAudiences}
        />
        <PostViewContent
          postId={postId}
          isLite={isLite}
          content={isLite && highlight ? highlight : content}
          images={images}
          isPostDetail={isPostDetail}
          onContentLayout={onContentLayout}
        />
        {!isLite && (
          <ReactionView
            style={styles.reactions}
            ownReactions={own_reactions}
            reactionCounts={reaction_counts}
            onAddReaction={onAddReaction}
            onRemoveReaction={onRemoveReaction}
            onLongPressReaction={onLongPressReaction}
          />
        )}
        {isLite ? (
          <PostViewFooterLite reactionCounts={reaction_counts} />
        ) : (
          <PostViewFooter
            labelButtonComment={labelButtonComment}
            onAddReaction={onAddReaction}
            onPressComment={_onPressComment}
            btnReactTestID={btnReactTestID}
            btnCommentTestID={btnCommentTestID}
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
