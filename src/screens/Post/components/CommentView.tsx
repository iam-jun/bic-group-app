import React, {useState, useEffect, useCallback, useRef} from 'react';
import {Animated as RNAnimated, Platform, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import Avatar from '~/beinComponents/Avatar';
import Button from '~/beinComponents/Button';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Div from '~/beinComponents/Div';
import EmojiBoard from '~/beinComponents/emoji/EmojiBoard';
import Icon from '~/beinComponents/Icon';
import ReactionView from '~/beinComponents/ReactionView';
import Text from '~/beinComponents/Text';
import CollapsibleText from '~/beinComponents/Text/CollapsibleText';
import TimeView from '~/beinComponents/TimeView';
import {ReactionType} from '~/constants/reactions';
import {useUserIdAuth} from '~/hooks/auth';
import {useRootNavigation} from '~/hooks/navigation';
import {useKeySelector} from '~/hooks/selector';
import {IPayloadReactionDetailBottomSheet} from '~/interfaces/IModal';
import {
  IMarkdownAudience,
  IPayloadDeleteComment,
  IPayloadReactToComment,
  IReaction,
} from '~/interfaces/IPost';
import mainStack from '~/router/navigator/MainStack/stack';
import CommentMediaView from '~/screens/Post/components/CommentMediaView';
import CommentViewMenu from '~/screens/Post/components/CommentViewMenu';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import postActions from '~/screens/Post/redux/actions';
import postKeySelector from '~/screens/Post/redux/keySelector';
import * as modalActions from '~/store/modal/actions';
import {showReactionDetailBottomSheet} from '~/store/modal/actions';
import {ITheme} from '~/theme/interfaces';
import {useBaseHook} from '~/hooks';

export interface CommentViewProps {
  postId: string;
  groupIds: string;
  parentCommentId?: string;
  commentData: IReaction;
  onPressReply: (data: IReaction) => void;
  contentBackgroundColor?: string;
}

const _CommentView: React.FC<CommentViewProps> = ({
  postId,
  groupIds,
  parentCommentId,
  commentData,
  onPressReply,
  contentBackgroundColor,
}: CommentViewProps) => {
  const animated = useRef(new RNAnimated.Value(0)).current;

  const {rootNavigation} = useRootNavigation();
  const {t} = useBaseHook();
  const dispatch = useDispatch();
  const theme: ITheme = useTheme() as ITheme;
  const {colors, spacing, dimension} = theme;
  const styles = createStyle(theme);

  const currentUserId = useUserIdAuth();

  const comment = useKeySelector(postKeySelector.commentById(commentData?.id));
  const {
    id,
    user_id,
    data,
    created_at,
    user,
    children_counts,
    own_children,
    reactions_order,
  } = comment || commentData || {};
  const {content, edited, images} = data || {};
  const avatar = user?.data?.avatar || '';
  const name = user?.data?.fullname || '';

  const [commentStatus, setCommentStatus] = useState(
    commentData?.status || null,
  );
  const isActive =
    Platform.OS === 'web'
      ? true
      : commentStatus === 'success' || commentStatus === null;

  const progress = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({opacity: progress.value}));

  const ViewComponent: any = Platform.OS === 'web' ? View : Animated.View;

  useEffect(() => {
    if (Platform.OS === 'web') return;

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
    progress.value = withTiming(value, {duration});
  };

  const onPressUser = (e?: any) => {
    const id = user?.id;
    if (!id) return;

    const payload = {
      userId: id,
      position: {x: e?.pageX, y: e?.pageY},
    };
    dispatch(modalActions.showUserProfilePreviewBottomSheet(payload));
  };

  const onPressAudience = useCallback((audience: IMarkdownAudience) => {
    if (!audience) return;
    rootNavigation.navigate(mainStack.userProfile, {userId: audience.id});
  }, []);

  const onAddReaction = (reactionId: ReactionType) => {
    if (id) {
      const payload: IPayloadReactToComment = {
        id,
        comment: comment || commentData,
        postId,
        parentCommentId,
        reactionId: reactionId,
        ownReaction: own_children,
        reactionCounts: children_counts,
      };
      dispatch(postActions.postReactToComment(payload));
    }
  };

  const onRemoveReaction = (reactionId: ReactionType) => {
    if (id) {
      const payload: IPayloadReactToComment = {
        id,
        comment: comment || commentData,
        postId,
        parentCommentId,
        reactionId: reactionId,
        ownReaction: own_children,
        reactionCounts: children_counts,
      };
      dispatch(postActions.deleteReactToComment(payload));
    }
  };

  const onEmojiSelected = (emoji: string, key?: string) => {
    dispatch(modalActions.hideModal());
    if (key) {
      onAddReaction?.(key);
    }
  };

  const onPressReact = (event: any) => {
    const payload = {
      isOpen: true,
      ContentComponent: (
        <EmojiBoard
          width={Platform.OS === 'web' ? 320 : dimension.deviceWidth}
          height={280}
          onEmojiSelected={onEmojiSelected}
        />
      ),
      props: {
        webModalStyle: {minHeight: undefined},
        isContextMenu: true,
        position: {x: event?.pageX, y: event?.pageY},
        side: 'center',
      },
    };
    dispatch(modalActions.showModal(payload));
  };

  const _onPressReply = () => {
    onPressReply?.(commentData);
  };

  const _onPressDelete = () => {
    const alertPayload = {
      title: t('post:comment:title_delete_comment'),
      content: t('post:comment:text_delete_comment'),
      ContentComponent: Text.BodyS,
      cancelBtn: true,
      cancelBtnProps: {
        textColor: theme.colors.primary7,
      },
      onConfirm: () => {
        const payload: IPayloadDeleteComment = {
          commentId: id,
          parentCommentId: parentCommentId,
          postId: postId,
        };
        dispatch(postActions.deleteComment(payload));
      },
      confirmLabel: t('common:btn_delete'),
      ConfirmBtnComponent: Button.Danger,
    };
    dispatch(modalActions.showAlert(alertPayload));
  };

  const onLongPress = (event?: any) => {
    dispatch(
      modalActions.showModal({
        isOpen: true,
        ContentComponent: (
          <CommentViewMenu
            commentId={id}
            content={content}
            groupIds={groupIds}
            isActor={currentUserId === user_id}
            onPressMoreReaction={onPressReact}
            onAddReaction={onAddReaction}
            onPressReply={_onPressReply}
            onPressDelete={_onPressDelete}
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

  const onMouseOver = () => {
    RNAnimated.timing(animated, {
      toValue: 1,
      duration: 0,
      useNativeDriver: false,
    }).start();
  };

  const onMouseLeave = () => {
    RNAnimated.timing(animated, {
      toValue: 0,
      duration: 0,
      useNativeDriver: false,
    }).start();
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
      reactionCounts: children_counts,
      initReaction: reactionType,
      getDataParam: {postId, commentId: id},
      getDataPromise: getReactionStatistics,
    };
    dispatch(showReactionDetailBottomSheet(payload));
  };

  const renderWebMenuButton = () => {
    if (Platform.OS !== 'web') {
      return null;
    }

    return (
      <RNAnimated.View style={[styles.webMenuButton, {opacity: animated}]}>
        <Button>
          <Icon
            testID={'comment_view.menu'}
            style={{}}
            onPress={onLongPress}
            icon={'EllipsisH'}
            tintColor={colors.textSecondary}
            disabled={!isActive}
          />
        </Button>
      </RNAnimated.View>
    );
  };

  const renderReactionsReplyView = () => {
    return (
      isActive && (
        <View style={styles.buttonContainer}>
          <ReactionView
            ownReactions={own_children}
            reactionCounts={children_counts}
            reactionsOrder={reactions_order}
            onAddReaction={onAddReaction}
            onRemoveReaction={onRemoveReaction}
            onPressSelectReaction={onPressReact}
            onLongPressReaction={onLongPressReaction}
          />
          <ButtonWrapper onPress={_onPressReply} testID="comment_view.reply">
            <Text.ButtonSmall
              style={styles.buttonReply}
              color={colors.textSecondary}>
              Reply
            </Text.ButtonSmall>
          </ButtonWrapper>
        </View>
      )
    );
  };

  const onPressRetry = () => {
    dispatch(postActions.postRetryAddComment(commentData));
  };

  const onPressCancel = () => {
    dispatch(postActions.postCancelFailedComment(commentData));
  };

  const renderErrorState = () => {
    return (
      commentStatus === 'failed' && (
        <View style={styles.errorLine}>
          <Text.BodySM color={colors.error} useI18n>
            common:text_failed_to_upload
          </Text.BodySM>
          <Text.BodySM>{`  • `}</Text.BodySM>
          <Button onPress={onPressRetry}>
            <Text.BodySM useI18n>common:text_retry</Text.BodySM>
          </Button>
          <Text.BodySM>{`  • `}</Text.BodySM>
          <Button onPress={onPressCancel}>
            <Text.BodySM useI18n>common:btn_cancel</Text.BodySM>
          </Button>
        </View>
      )
    );
  };

  return (
    <Div onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
      <ViewComponent
        style={[styles.container, Platform.OS !== 'web' && animatedStyle]}>
        <ButtonWrapper onPress={onPressUser} testID="comment_view.avatar">
          <Avatar isRounded source={avatar} />
        </ButtonWrapper>
        <View style={{flex: 1, marginLeft: spacing?.margin.small}}>
          <Button
            onLongPress={onLongPress}
            disabled={!isActive}
            testID="comment_view.comment_content">
            <View style={{flex: 1}}>
              <View
                style={StyleSheet.flatten([
                  styles.contentContainer,
                  contentBackgroundColor
                    ? {backgroundColor: contentBackgroundColor}
                    : {},
                ])}>
                <View style={styles.header}>
                  <View style={styles.userName}>
                    <ButtonWrapper onPress={onPressUser}>
                      <Text.H6 numberOfLines={1}>{`${name}`}</Text.H6>
                    </ButtonWrapper>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    {edited && (
                      <Text.H6 color={colors.textSecondary}>
                        {t('post:comment:text_edited')} •{' '}
                      </Text.H6>
                    )}
                    <TimeView
                      time={created_at}
                      style={styles.textTime}
                      type="short"
                      textProps={{variant: 'h6'}}
                    />
                    {/* <Icon icon="EllipsisH" size={16} style={styles.options} /> */}
                  </View>
                </View>
                <CollapsibleText
                  useMarkdown
                  limitMarkdownTypes
                  shortLength={200}
                  limitLength={200}
                  content={content || ''}
                  selector={`${postKeySelector.allComments}.${id}.data.mentions.users`}
                  onPressAudience={onPressAudience}
                />
              </View>
              <CommentMediaView data={data} onLongPress={onLongPress} />
            </View>
          </Button>
          {renderReactionsReplyView()}
        </View>
        {renderWebMenuButton()}
      </ViewComponent>
      {renderErrorState()}
    </Div>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing, dimension} = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
    },
    contentContainer: {
      flex: 1,
      paddingVertical: spacing?.padding.small,
      paddingHorizontal: spacing?.padding.small,
      backgroundColor: colors.placeholder,
      borderRadius: spacing?.borderRadius.small,
    },
    buttonContainer: {
      flexDirection: 'row',
    },
    errorLine: {
      flexDirection: 'row',
      paddingTop: spacing.padding.base,
      // @ts-ignore
      marginLeft: dimension.avatarSizes['medium'] + spacing.margin.small,
    },
    buttonReply: {
      marginRight: spacing?.margin.tiny,
      paddingTop: spacing?.margin.base,
    },
    webMenuButton: {
      width: 32,
      height: 32,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: spacing.borderRadius.small,
      backgroundColor: colors.placeholder,
      marginLeft: spacing.margin.base,
    },
    textTime: {
      marginLeft: 2,
      color: colors.textSecondary,
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
  });
};

const CommentView = React.memo(_CommentView);
// CommentView.whyDidYouRender = true;
export default CommentView;
