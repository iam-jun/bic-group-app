import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Avatar from '~/baseComponents/Avatar';
import Button from '~/beinComponents/Button';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Text from '~/beinComponents/Text';
import CollapsibleText from '~/beinComponents/Text/CollapsibleText';
import { ReactionType } from '~/constants/reactions';
import { useUserIdAuth } from '~/hooks/auth';
import { useRootNavigation } from '~/hooks/navigation';
import { useKeySelector } from '~/hooks/selector';
import { IPayloadReactionDetailBottomSheet } from '~/interfaces/IModal';
import {
  ICommentData,
  IMarkdownAudience,
  IPayloadDeleteComment,
  IPayloadReactToComment,
} from '~/interfaces/IPost';
import mainStack from '~/router/navigator/MainStack/stack';
import CommentMediaView from '~/screens/post/components/CommentMediaView';
import CommentViewMenu from '~/screens/post/components/CommentViewMenu';
import postActions from '~/storeRedux/post/actions';
import postKeySelector from '~/storeRedux/post/keySelector';
import * as modalActions from '~/storeRedux/modal/actions';
import { showReactionDetailBottomSheet } from '~/storeRedux/modal/actions';
import { useBaseHook } from '~/hooks';
import spacing from '~/theme/spacing';
import dimension from '~/theme/dimension';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import TimeView from '~/beinComponents/TimeView';
import ReactionView from '~/beinComponents/ReactionView';
import useMentionInputStore from '~/beinComponents/inputs/MentionInput/store';
import IMentionInputState from '~/beinComponents/inputs/MentionInput/store/Interface';

export interface CommentViewProps {
  postId: string;
  groupIds: string;
  parentCommentId?: string;
  commentData: ICommentData;
  onPressReply: (data: ICommentData) => void;
  contentBackgroundColor?: string;
  onPressMarkSeenPost?: () => void;
}

const _CommentView: React.FC<CommentViewProps> = ({
  postId,
  groupIds,
  parentCommentId,
  commentData,
  onPressReply,
  contentBackgroundColor,
  onPressMarkSeenPost,
}: CommentViewProps) => {
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const dispatch = useDispatch();
  const addTempSelected = useMentionInputStore((state:IMentionInputState) => state.addTempSelected);
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const currentUserId = useUserIdAuth();

  const comment = useKeySelector(postKeySelector.commentById(commentData?.id));
  const setting = useKeySelector(postKeySelector.postSettingById(postId));

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
  } = _commentData;
  const giphy
    = _commentData.giphy
    || (_commentData.giphyId
      ? {
        id: _commentData.giphyId,
        url: _commentData.giphyUrl,
      }
      : null);

  const { fullname, avatar } = actor || {};

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

  const onPressUser = (e?: any) => {
    const id = actor?.id;
    if (!id) return;

    const payload = {
      userId: id,
      position: { x: e?.pageX, y: e?.pageY },
    };
    dispatch(modalActions.showUserProfilePreviewBottomSheet(payload));
  };

  const onPressAudience = useCallback((audience: IMarkdownAudience) => {
    if (!audience) return;
    rootNavigation.navigate(mainStack.userProfile, { userId: audience.id });
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
      dispatch(postActions.postReactToComment(payload));
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
      dispatch(postActions.deleteReactToComment(payload));
    }
  };

  const onEmojiSelected = (
    key: string,
  ) => {
    dispatch(modalActions.hideModal());
    if (key) {
      onAddReaction?.(key);
    }
  };

  const onPressReact = () => {
    dispatch(modalActions.setShowReactionBottomSheet(
      { visible: true, callback: onEmojiSelected },
    ));
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
      cancelBtnProps: {
        textColor: theme.colors.purple60,
      },
      onConfirm: () => {
        const payload: IPayloadDeleteComment = {
          commentId: id,
          parentCommentId,
          postId,
        };
        dispatch(postActions.deleteComment(payload));
      },
      confirmLabel: t('common:btn_delete'),
      ConfirmBtnComponent: Button.Danger,
    };
    dispatch(modalActions.showAlert(alertPayload));
  };

  const onLongPress = () => {
    dispatch(
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
            onPressMoreReaction={onPressReact}
            onAddReaction={onAddReaction}
            onPressReply={_onPressReply}
            onPressDelete={_onPressDelete}
          />
        ),
      }),
    );
  };

  const onLongPressReaction = (reactionType: ReactionType) => {
    const payload: IPayloadReactionDetailBottomSheet = {
      isOpen: true,
      reactionCounts: reactionsCount,
      initReaction: reactionType,
      getDataParam: { target: 'COMMENT', targetId: id },
    };
    dispatch(showReactionDetailBottomSheet(payload));
  };

  const renderReactionsReplyView = () => (
    isActive && (
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
          { !!setting?.canReact ? (
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
    )
  );

  const onPressRetry = () => {
    dispatch(postActions.postRetryAddComment(commentData));
  };

  const onPressCancel = () => {
    dispatch(postActions.postCancelFailedComment(commentData));
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

  return (
    <View>
      <Animated.View style={[styles.container, animatedStyle]}>
        <ButtonWrapper onPress={onPressUser} testID="comment_view.avatar">
          <Avatar isRounded source={avatar} />
        </ButtonWrapper>
        <View style={{ flex: 1, marginLeft: spacing.margin.small }}>
          <Button
            onLongPress={onLongPress}
            disabled={!isActive}
            testID="comment_view.comment_content"
          >
            <View style={{ flex: 1 }}>
              <View
                style={StyleSheet.flatten([
                  styles.contentContainer,
                  contentBackgroundColor
                    ? { backgroundColor: contentBackgroundColor }
                    : {},
                ])}
              >
                <View style={styles.header}>
                  <View style={styles.userName}>
                    <ButtonWrapper onPress={onPressUser}>
                      <Text.H5
                        numberOfLines={1}
                        testID={
                          parentCommentId
                            ? 'comment_view.level_2.user_name'
                            : 'comment_view.level_1.user_name'
                        }
                      >
                        {`${fullname}`}
                      </Text.H5>
                    </ButtonWrapper>
                  </View>
                </View>
                <CollapsibleText
                  useMarkdown
                  limitMarkdownTypes
                  parentCommentId={parentCommentId}
                  shortLength={200}
                  limitLength={200}
                  content={content || ''}
                  selector={`${postKeySelector.allComments}.${id}.mentions`}
                  onPressAudience={onPressAudience}
                  onToggleShowTextContent={onPressMarkSeenPost}
                />
              </View>
              <CommentMediaView
                giphy={giphy}
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
    contentContainer: {
      flex: 1,
      padding: spacing.padding.small,
      backgroundColor: colors.gray1,
      borderRadius: spacing?.borderRadius.large,
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
  });
};

const CommentView = React.memo(_CommentView);
// CommentView.whyDidYouRender = true;
export default CommentView;
