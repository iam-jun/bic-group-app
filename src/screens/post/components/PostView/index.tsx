import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { isEqual } from 'lodash';
import React, {
  FC, memo, useCallback, useState,
} from 'react';
import {
  Keyboard, StyleSheet, TouchableOpacity, View,
} from 'react-native';
import { useDispatch } from 'react-redux';

import Image from '~/beinComponents/Image';
import ReactionView from '~/beinComponents/ReactionView';
import Text from '~/beinComponents/Text';
import { ReactionType } from '~/constants/reactions';
import { useBaseHook } from '~/hooks';
import { useUserIdAuth } from '~/hooks/auth';
import { useRootNavigation } from '~/hooks/navigation';
import { useKeySelector } from '~/hooks/selector';
import { IPayloadReactionDetailBottomSheet } from '~/interfaces/IModal';
import {
  IAudienceGroup,
  IAudienceUser,
  IOwnReaction,
  IPayloadReactToPost,
  IPostActivity,
  IPostAudience,
  IPostSetting,
  IReactionCounts,
} from '~/interfaces/IPost';
import resourceImages from '~/resources/images';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import {
  ButtonMarkAsRead,
  PostViewContent,
  PostViewFooter,
  PostViewFooterLite,
  PostViewHeader,
  PostViewImportant,
} from '../PostViewComponents';
import postActions from '~/storeRedux/post/actions';
import postKeySelector from '~/storeRedux/post/keySelector';
import modalActions from '~/storeRedux/modal/actions';
import spacing from '~/theme/spacing';
import { formatLargeNumber } from '~/utils/formatData';
import SeenCountsView from '../SeenCountsView';
import UsersSeenPostBottomSheet from '../UsersSeenPostBottomSheet';
import { getPostViewMenu } from './helper';
import { BottomListProps } from '~/components/BottomList';
import { useMyPermissions } from '~/hooks/permissions';
import AlertDeleteAudiencesConfirmContent from '../AlertDeleteAudiencesConfirmContent';
import PostAudiencesModal from '~/screens/post/components/PostAudiencesModal';
import { Button } from '~/baseComponents';

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
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  let actor: IAudienceUser | undefined;
  let audience: IPostAudience | undefined;
  let deleted: boolean;
  let markedReadPost: boolean;
  let ownerReactions: IOwnReaction;
  let reactionsCount: IReactionCounts;
  let isDraft: boolean;
  let createdAt: string | undefined;
  let media: any;
  let content: string;
  let highlight: string;
  let setting: IPostSetting;
  let commentsCount: number;
  let totalUsersSeen: number;

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
    totalUsersSeen = useKeySelector(
      postKeySelector.postTotalUsersSeenById(postId),
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
    totalUsersSeen = postData?.totalUsersSeen || 0;
  }

  const { images, videos, files } = media || {};
  const {
    isImportant, importantExpiredAt, canComment, canReact,
  }
    = setting || {};

  const userId = useUserIdAuth();

  const [isMarkSeenPost, setMarkSeenPost] = useState(false);

  const commentCount = formatLargeNumber(commentsCount);
  const labelButtonComment = `${commentCount ? `${commentCount} ` : ''}${t(
    'post:button_comment',
  )}`;

  const { hasPermissionsOnAtLeastOneScope, PERMISSION_KEY }
    = useMyPermissions();
  const canDeleteOwnPost = hasPermissionsOnAtLeastOneScope(
    'groups',
    audience?.groups,
    PERMISSION_KEY.GROUP.DELETE_OWN_POST,
  );

  const onPressShowAudiences = () => {
    dispatch(
      modalActions.showModal({
        isOpen: true,
        isFullScreen: true,
        titleFullScreen: t('post:title_post_to'),
        ContentComponent: <PostAudiencesModal data={audience?.groups || []} />,
      }),
    );
  };

  const handleDeltePostError = (listIdAudiences: string[]) => {
    if (listIdAudiences?.length > 0 && audience?.groups?.length > 0) {
      const listAudiences = listIdAudiences.map((audienceId) => {
        const _audience = audience.groups.find(
          (audience: IAudienceGroup) => audience?.id === audienceId,
        );
        return _audience;
      });
      if (canDeleteOwnPost) {
        dispatch(
          modalActions.showAlert({
            title: t('post:title_delete_audiences_of_post'),
            children: (
              <AlertDeleteAudiencesConfirmContent
                data={listAudiences}
                canDeleteOwnPost={canDeleteOwnPost}
              />
            ),
            cancelBtn: true,
            confirmLabel: t('common:text_remove'),
            ConfirmBtnComponent: Button.Danger,
            onConfirm: () => dispatch(
              postActions.removePostAudiences({
                id: postId,
                listAudiences: listIdAudiences,
              }),
            ),
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            confirmBtnProps: { type: 'ghost' },
          }),
        );
      } else {
        dispatch(
          modalActions.showAlert({
            title: t('post:title_delete_audiences_of_post'),
            children: (
              <AlertDeleteAudiencesConfirmContent
                data={listAudiences}
                canDeleteOwnPost={canDeleteOwnPost}
              />
            ),
            cancelBtn: true,
            cancelLabel: t('common:btn_close'),
            onConfirm: null,
          }),
        );
      }
    }
  };

  const onPressMenu = () => {
    Keyboard.dismiss();
    const data = getPostViewMenu(
      reactionsCount,
      actor?.id == userId,
      dispatch,
      rootNavigation,
      postId,
      isPostDetail,
      isDraft,
      handleDeltePostError,
    );

    dispatch(
      modalActions.showBottomList({ isOpen: true, data } as BottomListProps),
    );
  };

  const onAddReaction = (reactionId: ReactionType) => {
    const payload: IPayloadReactToPost = {
      id: postId,
      reactionId,
      ownReaction: ownerReactions,
      reactionCounts: reactionsCount,
    };
    dispatch(postActions.postReactToPost(payload));
    onPressMarkSeenPost();
  };

  const onRemoveReaction = (reactionId: ReactionType) => {
    const payload: IPayloadReactToPost = {
      id: postId,
      reactionId,
      ownReaction: ownerReactions,
      reactionCounts: reactionsCount,
    };
    dispatch(postActions.deleteReactToPost(payload));
  };

  const onLongPressReaction = (reactionType: ReactionType) => {
    const payload: IPayloadReactionDetailBottomSheet = {
      isOpen: true,
      reactionCounts: reactionsCount,
      initReaction: reactionType,
      getDataParam: { target: 'POST', targetId: postId },
    };
    dispatch(modalActions.showReactionDetailBottomSheet(payload));
  };

  const onPressSeenBy = () => {
    dispatch(
      modalActions.showModal({
        isOpen: true,
        isFullScreen: true,
        titleFullScreen: t('post:title_seen_by'),
        ContentComponent: <UsersSeenPostBottomSheet postId={postId} />,
      }),
    );
  };
  const _onPressHeader = () => {
    if (onPressHeader) {
      onPressHeader?.(postId);
    } else {
      rootNavigation.navigate(homeStack.postDetail, { post_id: postId });
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
      rootNavigation.navigate(homeStack.postDetail, { post_id: postId });
    } else {
      onPress?.();
    }
  };

  const onPressMarkSeenPost = useCallback(() => {
    if (!isMarkSeenPost) {
      dispatch(postActions.putMarkSeenPost({ postId }));
      setMarkSeenPost(!isMarkSeenPost);
    }
  }, [postId, isMarkSeenPost]);

  if (deleted) {
    return (
      <View style={StyleSheet.flatten([styles.deletedContainer, style])}>
        <Image style={styles.imageDelete} source={resourceImages.img_delete} />
        <Text.H6 testID="post_view.label_deleted" useI18n>
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
      style={style}
    >
      <PostViewImportant
        isLite={isLite}
        isImportant={!!isImportant}
        expireTime={importantExpiredAt}
        markedReadPost={markedReadPost}
      />
      <View style={[styles.container]} onLayout={() => onContentLayout?.()}>
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
          files={files}
          isPostDetail={isPostDetail}
          onPressMarkSeenPost={onPressMarkSeenPost}
        />
        {!isLite && (
          <SeenCountsView
            onPress={onPressSeenBy}
            seenPeopleCount={totalUsersSeen}
          />
        )}
        {!isLite && !!canReact && (
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
          <PostViewFooterLite
            reactionsCount={5}
            commentsCount={commentsCount}
            seenCountsViewComponent={(
              <SeenCountsView
                style={styles.seenCountsViewAtBottom}
                onPress={onPressSeenBy}
                seenPeopleCount={totalUsersSeen}
              />
            )}
          />
        ) : (
          <PostViewFooter
            labelButtonComment={labelButtonComment}
            onAddReaction={onAddReaction}
            onPressComment={_onPressComment}
            btnReactTestID={btnReactTestID}
            btnCommentTestID={btnCommentTestID}
            reactionCounts={reactionsCount}
            canComment={!!canComment}
            canReact={!!canReact}
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

const createStyle = (theme: ExtendedTheme) => {
  const { colors, elevations } = theme;
  return StyleSheet.create({
    rowCenter: { flexDirection: 'row', alignItems: 'center' },
    container: {
      backgroundColor: colors.white,
      ...elevations.e2,
    },
    reactions: {
      paddingHorizontal: spacing.padding.base,
    },
    deletedContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.padding.large,
      backgroundColor: colors.white,
    },
    imageDelete: { width: 35, height: 35, marginRight: spacing.margin.large },
    seenCountsViewAtBottom: {
      alignItems: 'center',
      paddingTop: 0,
      paddingBottom: 0,
      paddingHorizontal: 0,
    },
  });
};

function propsAreEqual(prev: any, next: any) {
  return isEqual(prev, next);
}

const PostView = memo(_PostView, propsAreEqual);
PostView.whyDidYouRender = true;
export default PostView;
