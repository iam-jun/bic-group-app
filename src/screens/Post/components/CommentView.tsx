import React, {useRef} from 'react';
import {View, StyleSheet, Keyboard} from 'react-native';
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
import ReactionView from '~/screens/Post/components/ReactionView';
import {useUserIdAuth} from '~/hooks/auth';
import {useKeySelector} from '~/hooks/selector';
import postKeySelector from '~/screens/Post/redux/keySelector';
import CommentViewMenuBottomSheet from '~/screens/Post/components/CommentViewMenuBottomSheet';
import Button from '~/beinComponents/Button';

import menuActions from '~/screens/Menu/redux/actions';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import {useRootNavigation} from '~/hooks/navigation';

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

  const {t} = useBaseHook();
  const {rootNavigation} = useRootNavigation();
  const dispatch = useDispatch();
  const theme: ITheme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  const currentUserId = useUserIdAuth();

  const comment = useKeySelector(postKeySelector.commentById(commentData?.id));
  const {id, user_id, data, created_at, user, children_counts, own_children} =
    comment || commentData || {};
  const {content} = data || {};
  const avatar = user?.data?.avatar || '';
  const name = user?.data?.fullname || '';

  let postTime = '';
  if (created_at) {
    postTime = countTime(created_at);
  }

  const onPressUser = () => {
    if (user?.id) {
      dispatch(
        menuActions.selectedProfile({
          id: user?.id?.toString(),
          isPublic: true,
        }),
      );
      rootNavigation.navigate(homeStack.publicProfile);
    }
  };

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

  const onPressReact = () => {
    dispatch(
      postActions.setShowReactionBottomSheet({
        show: true,
        title: t('post:label_all_reacts'),
        callback: onAddReaction,
      }),
    );
  };

  const _onPressReply = () => {
    onPressReply?.(commentData);
  };

  const onLongPress = (e?: any) => {
    Keyboard.dismiss();
    menuSheetRef?.current?.open?.(e?.pageX, e?.pageY);
  };

  return (
    <View>
      <View style={styles.container}>
        <Avatar source={avatar} />
        <View style={{flex: 1, marginLeft: spacing?.margin.small}}>
          <Button onLongPress={onLongPress}>
            <View
              style={StyleSheet.flatten([
                styles.contentContainer,
                contentBackgroundColor
                  ? {backgroundColor: contentBackgroundColor}
                  : {},
              ])}>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                  <ButtonWrapper
                    style={{alignSelf: 'flex-start'}}
                    onPress={onPressUser}>
                    <Text.H6>{name}</Text.H6>
                  </ButtonWrapper>
                </View>
                <Text.Subtitle color={colors.textSecondary}>
                  {postTime}
                </Text.Subtitle>
              </View>
              <CollapsibleText
                useMarkdown
                limitMarkdownTypes
                content={content || ''}
              />
            </View>
          </Button>
          <View style={styles.buttonContainer}>
            <ReactionView
              ownReactions={own_children}
              reactionCounts={children_counts}
              onAddReaction={onAddReaction}
              onRemoveReaction={onRemoveReaction}
              onPressSelectReaction={onPressReact}
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
      </View>
      <CommentViewMenuBottomSheet
        modalizeRef={menuSheetRef}
        commentId={id}
        groupIds={groupIds}
        isActor={currentUserId === user_id}
        onPressMoreReaction={onPressReact}
        onAddReaction={onAddReaction}
        onPressReply={_onPressReply}
      />
    </View>
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
      backgroundColor: colors.surface,
      borderRadius: spacing?.borderRadius.small,
    },
    buttonContainer: {
      flexDirection: 'row',
    },
    buttonReply: {
      marginRight: spacing?.margin.tiny,
      marginTop: spacing?.margin.large,
    },
  });
};

export default CommentView;
