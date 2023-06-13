import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import Avatar from '~/baseComponents/Avatar';
import Button from '~/beinComponents/Button';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import useMentionInputStore from '~/beinComponents/inputs/MentionInput/store';
import IMentionInputState from '~/beinComponents/inputs/MentionInput/store/Interface';
import ReactionView from '~/beinComponents/ReactionView';
import Text from '~/baseComponents/Text';
import CollapsibleText from '~/baseComponents/Text/CollapsibleText';
import TimeView from '~/beinComponents/TimeView';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import CommentMediaView from '~/screens/comments/components/CommentMediaView';
import CommentViewMenu from '~/screens/comments/components/CommentViewMenu';
import { ReactionType } from '~/constants/reactions';
import { useBaseHook } from '~/hooks';
import { useUserIdAuth } from '~/hooks/auth';
import { useRootNavigation } from '~/hooks/navigation';
import { IPayloadReactionDetailBottomSheet } from '~/interfaces/IModal';
import {
  ICommentData,
  IMarkdownAudience,
  IPayloadDeleteComment,
  IPayloadReactToComment,
  IPostAudience,
} from '~/interfaces/IPost';
import mainStack from '~/router/navigator/MainStack/stack';
import useCommonController from '~/screens/store';
import useCommentsStore from '~/store/entities/comments';
import commentsSelector from '~/store/entities/comments/selectors';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import dimension from '~/theme/dimension';
import spacing from '~/theme/spacing';
import useCommentInputStore from '../CommentInputView/store';
import useDeleteCommentController from './store';
import { PlaceHolderRemoveContent } from '~/baseComponents';
import useModalStore from '~/store/modal';
import DeactivatedView from '~/components/DeactivatedView';
import VerifiedView from '~/components/VerifiedView';
import UserBadge from '~/screens/Menu/UserProfile/components/UserBadge';

export interface CommentViewProps {
  postId: string;
  groupIds: string;
  audience: IPostAudience;
  parentCommentId?: string;
  commentData: ICommentData;
  contentBackgroundColor?: string;
  onPressReply: (data: ICommentData) => void;
  onPressMarkSeenPost?: () => void;
}

const _CommentView: React.FC<CommentViewProps> = ({
  postId,
  groupIds,
  audience,
  parentCommentId,
  commentData,
  contentBackgroundColor,
  onPressReply,
  onPressMarkSeenPost,
}: CommentViewProps) => {
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const commentInputStore = useCommentInputStore((state) => state.actions);
  const deleteCommentController = useDeleteCommentController((state) => state.actions);

  const addTempSelected = useMentionInputStore((state:IMentionInputState) => state.addTempSelected);
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const currentUserId = useUserIdAuth();

  const commonController = useCommonController((state) => state.actions);
  const comment = useCommentsStore(useCallback(commentsSelector.getComment(commentData?.id), [commentData?.id]));
  const isReported = comment?.reportDetails?.length > 0;

  const setting = usePostsStore(postsSelector.getSetting(postId));
  const cancelCommentFailed = useCommentsStore((state) => state.actions.cancelCommentFailed);
  const modalActions = useModalStore((state) => state.actions);

  const _commentData = comment || commentData || {};
  const {
    id,
    actor,
    content,
    media,
    ownerReactions,
    reactionsCount,
    createdAt,
    updatedAt,
    edited,
    mentions,
    reported,
  } = _commentData;
  const giphy
    = _commentData.giphy
    || (_commentData.giphyId
      ? {
        id: _commentData.giphyId,
        url: _commentData.giphyUrl,
      }
      : null);

  const {
    fullname, avatar, isDeactivated, isVerified, showingBadges = [],
  } = actor || {};

  const isActor = currentUserId === actor?.id;

  const [commentStatus, setCommentStatus] = useState(
    commentData?.status || null,
  );
  const isActive = commentStatus === 'success' || commentStatus === null;

  const progress = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ opacity: progress.value }));

  useEffect(() => {
    if (isActive) {
      showComment(1);
    } else if (commentStatus === 'pending') {
      showComment(0.5);
    }
  }, [commentStatus]);

  useEffect(() => {
    setCommentStatus(commentData?.status || null);
  }, [commentData?.status]);

  const showComment = (value: number, duration = 300) => {
    progress.value = withTiming(value, { duration });
  };

  const navigateToUserProfile = (userId: string) => {
    rootNavigation.navigate(mainStack.userProfile, { userId });
  };

  const onPressUser = () => {
    const id = actor?.id;
    if (!id || isDeactivated) return;
    navigateToUserProfile(id);
  };

  const onPressAudience = useCallback((audience: IMarkdownAudience) => {
    if (!audience || audience?.isDeactivated) return;
    navigateToUserProfile(audience.id);
  }, []);

  const onAddReaction = (reactionId: ReactionType) => {
    if (id) {
      const payload: IPayloadReactToComment = {
        id,
        comment: comment || commentData,
        postId,
        parentCommentId,
        reactionId,
        ownerReactions,
        reactionsCount,
      };
      commonController.putReactionToComment(payload);
      onPressMarkSeenPost?.();
    }
  };

  const onRemoveReaction = (reactionId: ReactionType) => {
    if (id) {
      const payload: IPayloadReactToComment = {
        id,
        comment: comment || commentData,
        postId,
        parentCommentId,
        reactionId,
        ownerReactions,
        reactionsCount,
      };
      commonController.deleteReactToComment(payload);
    }
  };

  const onEmojiSelected = (
    key: string,
  ) => {
    modalActions.hideModal();
    if (key) {
      onAddReaction?.(key);
    }
  };

  const onPressReact = () => {
    modalActions.setShowReactionBottomSheet(
      { visible: true, callback: onEmojiSelected },
    );
  };

  const _onPressReply = () => {
    const actor: any = commentData?.actor || {};
    const username = actor?.data?.username || actor?.username || '';
    addTempSelected({
      [username]: { id: actor?.id, ...actor },
    });
    onPressReply?.(commentData);
  };

  const _onPressDelete = () => {
    const alertPayload = {
      title: t('post:comment:title_delete_comment'),
      content: t('post:comment:text_delete_comment'),
      ContentComponent: Text.BodyS,
      cancelBtn: true,
      onConfirm: () => {
        const payload: IPayloadDeleteComment = {
          commentId: id,
          parentCommentId,
          postId,
        };
        deleteCommentController.deleteComment(payload);
      },
      confirmLabel: t('common:btn_delete'),
      ConfirmBtnComponent: Button.Danger,
    };
    modalActions.showAlert(alertPayload);
  };

  const onLongPress = () => {
    if (isReported) {
      return null;
    }
    modalActions.showModal({
      isOpen: true,
      ContentComponent: (
        <CommentViewMenu
          commentId={id}
          parentCommentId={parentCommentId}
          content={content}
          groupIds={groupIds}
          postId={postId}
          isActor={isActor}
          audience={audience}
          onPressMoreReaction={onPressReact}
          onAddReaction={onAddReaction}
          onPressReply={_onPressReply}
          onPressDelete={_onPressDelete}
        />
      ),
    });
  };

  const onLongPressReaction = (reactionType: ReactionType) => {
    const payload: IPayloadReactionDetailBottomSheet = {
      reactionsCount,
      initReaction: reactionType,
      getDataParam: { target: 'COMMENT', targetId: id },
    };
    modalActions.showReactionDetailBottomSheet(payload);
  };

  const onPressRetry = () => {
    commentInputStore.retryAddComment(commentData);
  };

  const onPressCancel = () => {
    cancelCommentFailed(commentData);
  };

  const renderReactionsReplyView = () => {
    if (isActive && !isReported) {
      return (
        <View style={{ marginTop: spacing.margin.tiny }}>
          <ReactionView
            style={styles.reactionView}
            ownerReactions={ownerReactions}
            reactionsCount={reactionsCount}
            onAddReaction={onAddReaction}
            onRemoveReaction={onRemoveReaction}
            onLongPressReaction={onLongPressReaction}
          />
          <View style={styles.buttonContainer}>
            {!!setting?.canReact ? (
              <>
                <ButtonWrapper onPress={onPressReact} testID="comment_view.react">
                  <Text.BodySMedium useI18n color={colors.neutral40}>
                    post:button_react
                  </Text.BodySMedium>
                </ButtonWrapper>
                <ViewSpacing width={16} />
              </>
            ) : null}
            <ButtonWrapper onPress={_onPressReply} testID="comment_view.reply">
              <Text.BodySMedium useI18n color={colors.neutral40}>
                post:button_reply
              </Text.BodySMedium>
            </ButtonWrapper>
            <ViewSpacing width={16} />
            <TimeView
              time={edited ? updatedAt : createdAt}
              type="short"
              textProps={{ variant: 'bodyS', colors: colors.neutral40 }}
            />
            <ViewSpacing width={16} />
            {edited && (
              <Text.BodyS useI18n color={colors.neutral40}>
                post:comment:text_edited
              </Text.BodyS>
            )}
          </View>
        </View>
      );
    }
    return null;
  };

  const renderErrorState = () => commentStatus === 'failed' && (
  <View style={styles.errorLine}>
    <Text.BodySMedium color={colors.red60} useI18n>
      common:text_failed_to_upload
    </Text.BodySMedium>
    <Text.BodySMedium>{'  • '}</Text.BodySMedium>
    <Button onPress={onPressRetry}>
      <Text.BodySMedium useI18n color={colors.neutral40}>common:text_retry</Text.BodySMedium>
    </Button>
    <Text.BodySMedium>{'  • '}</Text.BodySMedium>
    <Button onPress={onPressCancel}>
      <Text.BodySMedium useI18n color={colors.neutral40}>common:btn_cancel</Text.BodySMedium>
    </Button>
  </View>
  );

  if (reported) {
    return (
      <PlaceHolderRemoveContent label="common:text_comment_reported" />
    );
  }

  const colorFullName = isDeactivated ? colors.grey40 : colors.neutral80;

  return (
    <View>
      <Animated.View style={[styles.container, animatedStyle]}>
        <ButtonWrapper testID="comment_view.avatar" onPress={onPressUser}>
          <Avatar isRounded source={avatar} />
        </ButtonWrapper>
        <View style={styles.commentWrapper}>
          <Button
            testID="comment_view.comment_content"
            disabled={!isActive}
            onLongPress={onLongPress}
          >
            <View style={styles.flex1}>
              <View
                style={[
                  styles.contentContainer,
                  contentBackgroundColor
                    ? { backgroundColor: contentBackgroundColor }
                    : {},
                ]}
              >
                <View style={styles.header}>
                  <View style={styles.userName}>
                    <ButtonWrapper style={styles.buttonWrapper} onPress={onPressUser}>
                      <Text.H5
                        color={colorFullName}
                        testID={`comment_view.level_${parentCommentId ? 2 : 1}.user_name`}
                        numberOfLines={1}
                        style={styles.fullname}
                      >
                        {`${fullname}`}
                      </Text.H5>
                      <VerifiedView isVerified={isVerified} />
                      {isDeactivated && <DeactivatedView style={styles.deactivatedView} />}
                      {!isDeactivated && (
                        <UserBadge
                          isCurrentUser={false}
                          showingBadges={showingBadges}
                          style={styles.userBadge}
                          customStyleBadgeItem={styles.badgeItem}
                        />
                      )} 
                    </ButtonWrapper>
                  </View>
                </View>
                <CollapsibleText
                  useMarkdown
                  limitMarkdownTypes
                  shortLength={200}
                  limitLength={200}
                  content={content}
                  mentions={mentions}
                  parentCommentId={parentCommentId}
                  onPressAudience={onPressAudience}
                  onToggleShowTextContent={onPressMarkSeenPost}
                />
              </View>
              <CommentMediaView
                giphy={giphy as any}
                media={media}
                onLongPress={onLongPress}
              />
            </View>
          </Button>
          {renderReactionsReplyView()}
        </View>
      </Animated.View>
      {renderErrorState()}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
    },
    commentWrapper: {
      flex: 1,
      marginLeft: spacing.margin.small,
    },
    contentContainer: {
      flex: 1,
      padding: spacing.padding.small,
      backgroundColor: colors.gray1,
      borderRadius: spacing?.borderRadius.large,
    },
    flex1: {
      flex: 1,
    },
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing?.margin.tiny,
    },
    errorLine: {
      flexDirection: 'row',
      paddingTop: spacing.padding.base,
      marginLeft: dimension.avatarSizes.medium + spacing.margin.small,
    },
    marginLeftItem: {
      marginLeft: spacing?.margin.large,
    },
    userName: {
      flex: 1,
      flexDirection: 'row',
    },
    header: {
      flexDirection: 'row',
      marginBottom: spacing.margin.tiny,
    },
    options: {
      marginLeft: spacing.margin.tiny,
      marginTop: 2,
    },
    reactionView: {
      paddingTop: 0,
      paddingBottom: 0,
    },
    buttonWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    deactivatedView: {
      marginLeft: spacing.margin.tiny,
    },
    fullname: {
      flexShrink: 1,
    },
    userBadge: {
      marginLeft: spacing.margin.small,
      height: '100%',
    },
    badgeItem: {
      width: 20,
      height: 20,
      marginRight: -spacing.margin.xSmall,
    },
  });
};

const CommentView = React.memo(_CommentView);
export default CommentView;
