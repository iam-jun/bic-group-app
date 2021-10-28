import React, {useCallback, useRef} from 'react';
import {Animated, View, StyleSheet, Keyboard, Platform} from 'react-native';
import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import {IPayloadReactToComment, IReaction} from '~/interfaces/IPost';
import Avatar from '~/beinComponents/Avatar';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import {countTime} from '~/utils/formatData';
import CollapsibleText from '~/beinComponents/Text/CollapsibleText';
import postActions from '~/screens/Post/redux/actions';
import {useDispatch} from 'react-redux';
import {useBaseHook} from '~/hooks';
import {ReactionType} from '~/constants/reactions';
import {useUserIdAuth} from '~/hooks/auth';
import {useKeySelector} from '~/hooks/selector';
import postKeySelector from '~/screens/Post/redux/keySelector';
import CommentViewMenuBottomSheet from '~/screens/Post/components/CommentViewMenuBottomSheet';
import Button from '~/beinComponents/Button';

import {useRootNavigation} from '~/hooks/navigation';
import Div from '~/beinComponents/Div';
import Icon from '~/beinComponents/Icon';
import mainStack from '~/router/navigator/MainStack/stack';
import {IPayloadReactionDetailBottomSheet} from '~/interfaces/IModal';
import {showReactionDetailBottomSheet} from '~/store/modal/actions';
import * as modalActions from '~/store/modal/actions';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import CommentMediaView from '~/screens/Post/components/CommentMediaView';
import ReactionView from '~/beinComponents/ReactionView';
import EmojiBoard from '~/beinComponents/emoji/EmojiBoard';

export interface CommentViewProps {
  postId: string;
  groupIds: string;
  parentCommentId?: string;
  commentData: IReaction;
  onPressReply: (data: IReaction) => void;
  contentBackgroundColor?: string;
}

const CommentView: React.FC<CommentViewProps> = ({
  postId,
  groupIds,
  parentCommentId,
  commentData,
  onPressReply,
  contentBackgroundColor,
}: CommentViewProps) => {
  const menuSheetRef = useRef<any>();
  const animated = useRef(new Animated.Value(0)).current;

  const {t} = useBaseHook();
  const {rootNavigation} = useRootNavigation();
  const dispatch = useDispatch();
  const theme: ITheme = useTheme() as ITheme;
  const {colors, spacing, dimension} = theme;
  const styles = createStyle(theme);

  const currentUserId = useUserIdAuth();

  const comment = useKeySelector(postKeySelector.commentById(commentData?.id));
  const {id, user_id, data, created_at, user, children_counts, own_children} =
    comment || commentData || {};
  const {content, images} = data || {};
  const avatar = user?.data?.avatar || '';
  const name = user?.data?.fullname || '';

  let postTime = '';
  if (created_at) {
    postTime = countTime(created_at);
  }

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
        userId: currentUserId,
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
        userId: currentUserId,
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
          width={Platform.OS === 'web' ? 400 : dimension.deviceWidth}
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

  const onLongPress = (e?: any) => {
    Keyboard.dismiss();
    menuSheetRef?.current?.open?.(e?.pageX, e?.pageY);
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
        <ButtonWrapper onPress={onPressUser}>
          <Avatar source={avatar} />
        </ButtonWrapper>
        <View style={{flex: 1, marginLeft: spacing?.margin.small}}>
          <Button onLongPress={onLongPress}>
            <View style={{flex: 1}}>
              <View
                style={StyleSheet.flatten([
                  styles.contentContainer,
                  contentBackgroundColor
                    ? {backgroundColor: contentBackgroundColor}
                    : {},
                ])}>
                <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
                  <ButtonWrapper onPress={onPressUser}>
                    <Text.H6>{name}</Text.H6>
                  </ButtonWrapper>
                  <Text.Subtitle
                    color={colors.textSecondary}
                    style={styles.textTime}>
                    {postTime}
                  </Text.Subtitle>
                </View>
                <CollapsibleText
                  useMarkdown
                  limitMarkdownTypes
                  content={content || ''}
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
            <ButtonWrapper onPress={_onPressReply}>
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
      <CommentViewMenuBottomSheet
        modalizeRef={menuSheetRef}
        commentId={id}
        content={content}
        groupIds={groupIds}
        isActor={currentUserId === user_id}
        onPressMoreReaction={onPressReact}
        onAddReaction={onAddReaction}
        onPressReply={_onPressReply}
      />
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
      paddingTop: spacing?.padding.tiny,
      paddingBottom: spacing?.padding.small,
      paddingHorizontal: spacing?.padding.small,
      backgroundColor: colors.placeholder,
      borderRadius: spacing?.borderRadius.small,
    },
    buttonContainer: {
      flexDirection: 'row',
    },
    buttonReply: {
      marginRight: spacing?.margin.tiny,
      paddingTop: spacing?.margin.small,
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
      marginLeft: spacing.margin.small,
    },
  });
};

export default CommentView;
