import React, {useCallback, useRef} from 'react';
import {Animated, Platform, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
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
import {IPayloadReactToComment, IReaction} from '~/interfaces/IPost';
import mainStack from '~/router/navigator/MainStack/stack';
import CommentMediaView from '~/screens/Post/components/CommentMediaView';
import CommentViewMenu from '~/screens/Post/components/CommentViewMenu';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import postActions from '~/screens/Post/redux/actions';
import postKeySelector from '~/screens/Post/redux/keySelector';
import * as modalActions from '~/store/modal/actions';
import {showReactionDetailBottomSheet} from '~/store/modal/actions';
import {ITheme} from '~/theme/interfaces';

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
  const animated = useRef(new Animated.Value(0)).current;

  const {rootNavigation} = useRootNavigation();
  const dispatch = useDispatch();
  const theme: ITheme = useTheme() as ITheme;
  const {colors, spacing, dimension} = theme;
  const styles = createStyle(theme);

  const currentUserId = useUserIdAuth();

  const comment = useKeySelector(postKeySelector.commentById(commentData?.id));
  const {id, user_id, data, created_at, user, children_counts, own_children} =
    comment || commentData || {};
  const {content} = data || {};
  const avatar = user?.data?.avatar || '';
  const name = user?.data?.fullname || '';

  const onPressUser = (e?: any) => {
    const id = user?.id;
    if (!id) return;

    const payload = {
      userId: id,
      position: {x: e?.pageX, y: e?.pageY},
    };
    dispatch(modalActions.showUserProfilePreviewBottomSheet(payload));
  };

  const onPressAudience = useCallback((audience: any) => {
    if (!audience || !audience?.id) return;
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
    Animated.timing(animated, {
      toValue: 1,
      duration: 0,
      useNativeDriver: false,
    }).start();
  };

  const onMouseLeave = () => {
    Animated.timing(animated, {
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
      <Animated.View style={[styles.webMenuButton, {opacity: animated}]}>
        <Button>
          <Icon
            style={{}}
            onPress={onLongPress}
            icon={'EllipsisH'}
            tintColor={colors.textSecondary}
          />
        </Button>
      </Animated.View>
    );
  };

  return (
    <Div onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
      <View style={styles.container}>
        <ButtonWrapper onPress={onPressUser} testID="comment_view.avatar">
          <Avatar isRounded source={avatar} />
        </ButtonWrapper>
        <View style={{flex: 1, marginLeft: spacing?.margin.small}}>
          <Button
            onLongPress={onLongPress}
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
                    <TimeView
                      time={created_at}
                      style={styles.textTime}
                      type="short"
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
                  selector={postKeySelector.allCommentsByParentIds}
                  parentId={id}
                  onPressAudience={onPressAudience}
                />
              </View>
              <CommentMediaView data={data} onLongPress={onLongPress} />
            </View>
          </Button>
          <View style={styles.buttonContainer}>
            <ReactionView
              ownReactions={own_children}
              reactionCounts={children_counts}
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
        </View>
        {renderWebMenuButton()}
      </View>
    </Div>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
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
