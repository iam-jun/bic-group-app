import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { isEmpty, isEqual } from 'lodash';
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
import { IPayloadReactionDetailBottomSheet } from '~/interfaces/IModal';
import {
  IAudienceGroup,
  IPayloadReactToPost,
  IPost,
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
import modalActions from '~/storeRedux/modal/actions';
import spacing from '~/theme/spacing';
import { formatLargeNumber } from '~/utils/formatData';
import { getPostViewMenu } from './helper';
import { BottomListProps } from '~/components/BottomList';
import { useMyPermissions } from '~/hooks/permissions';
import AlertDeleteAudiencesConfirmContent from '../AlertDeleteAudiencesConfirmContent';
import { Button } from '~/baseComponents';
import { getTotalReactions } from '../PostViewComponents/helper';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import ContentInterestedUserCount from '~/components/ContentView/components/ContentInterestedUserCount';
import useCommonController from '~/screens/store';
import appConfig from '~/configs/appConfig';

export interface PostViewProps {
  style?: any;
  testID?: string;
  postId: string;
  isPostDetail?: boolean;
  pressNavigateToDetail?: boolean;
  isLite?: boolean;
  postData?: IPost;
  btnReactTestID?: string;
  btnCommentTestID?: string;
  hasReactPermission?: boolean;

  onPress?: () => void;
  onPressHeader?: (postId: string) => void;
  onContentLayout?: () => void;
  onPressComment?: (postId: string) => void;
}

const _PostView: FC<PostViewProps> = ({
  style,
  testID = 'post_view',
  postId,
  isPostDetail = false,
  pressNavigateToDetail,
  isLite,
  postData,
  btnReactTestID,
  btnCommentTestID,
  hasReactPermission = true,

  onPress,
  onPressHeader,
  onPressComment,
  onContentLayout,
}: PostViewProps) => {
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  let _postData = postData;
  const commonController = useCommonController((state) => state.actions);
  if (!_postData) _postData = usePostsStore(useCallback(postsSelector.getPost(postId), [postId]));

  const {
    actor, audience, isDraft, createdAt, media, content, highlight, setting, deleted,
    markedReadPost, commentsCount, ownerReactions, reactionsCount, totalUsersSeen, linkPreview, mentions,
  } = _postData || {};

  const { images, videos, files } = media || {};
  const {
    isImportant, importantExpiredAt, canComment, canReact,
  } = setting || {};

  const isEmptyPost = !content
    && (!images || images?.length === 0)
    && (!videos || videos?.length === 0)
    && isEmpty(files);

  const userId = useUserIdAuth();

  const [isMarkSeenPost, setMarkSeenPost] = useState(false);

  const commentCount = formatLargeNumber(commentsCount);
  const labelButtonComment = `${commentCount ? `${commentCount} ` : ''}${t(
    'post:button_comment',
  )}`;

  const numberOfReactions = formatLargeNumber(getTotalReactions(reactionsCount, 'user'));

  const { hasPermissionsOnAtLeastOneScope, PERMISSION_KEY }
    = useMyPermissions();
  const canDeleteOwnPost = hasPermissionsOnAtLeastOneScope(
    'groups',
    audience?.groups,
    PERMISSION_KEY.GROUP.DELETE_OWN_POST,
  );

  const handleDeletePostError = (listIdAudiences: string[]) => {
    if (listIdAudiences?.length <= 0 || audience?.groups?.length <= 0) {
      return;
    }

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
      handleDeletePostError,
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
    commonController.putReactionToPost(payload);
    onPressMarkSeenPost();
  };

  const onRemoveReaction = (reactionId: ReactionType) => {
    const payload: IPayloadReactToPost = {
      id: postId,
      reactionId,
      ownReaction: ownerReactions,
      reactionCounts: reactionsCount,
    };
    commonController.deleteReactToPost(payload);
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

  const shouldShowInterested = highlight?.length < appConfig.shortPostContentLength
  || content?.length < appConfig.shortPostContentLength || isPostDetail;

  return (
    <TouchableOpacity
      testID={testID}
      activeOpacity={0.8}
      disabled={(!onPress && !pressNavigateToDetail) || !hasReactPermission}
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
          postId={postId}
          audience={audience}
          actor={actor}
          time={createdAt}
          onPressHeader={onPressHeader}
          onPressMenu={onPressMenu}
          disabled={!hasReactPermission}
        />
        <PostViewContent
          postId={postId}
          isLite={isLite}
          isEmptyPost={isEmptyPost}
          content={isLite && highlight ? highlight : content}
          images={images}
          videos={videos}
          files={files}
          mentions={mentions}
          isPostDetail={isPostDetail}
          onPressMarkSeenPost={onPressMarkSeenPost}
          linkPreview={linkPreview}
          totalUsersSeen={totalUsersSeen}
        />
        {!isLite && shouldShowInterested && (
          <ContentInterestedUserCount id={postId} interestedUserCount={totalUsersSeen} />
        )}
        {!isLite && !!canReact && (
          <ReactionView
            style={styles.reactions}
            ownerReactions={ownerReactions}
            reactionsCount={reactionsCount}
            onAddReaction={onAddReaction}
            onRemoveReaction={onRemoveReaction}
            onLongPressReaction={onLongPressReaction}
            hasReactPermission={hasReactPermission}
          />
        )}
        {isLite ? (
          <PostViewFooterLite
            reactionsCount={Number(numberOfReactions)}
            commentsCount={commentsCount}
            seenCountsViewComponent={(
              <ContentInterestedUserCount
                id={postId}
                interestedUserCount={totalUsersSeen}
                style={styles.seenCountsViewAtBottom}
                isLite
              />
            )}
          />
        ) : (
          <PostViewFooter
            postId={postId}
            labelButtonComment={labelButtonComment}
            btnReactTestID={btnReactTestID}
            btnCommentTestID={btnCommentTestID}
            reactionCounts={reactionsCount}
            canComment={!!canComment}
            canReact={!!canReact}
            hasReactPermission={hasReactPermission}
            onPressComment={onPressComment}
            onAddReaction={onAddReaction}
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
