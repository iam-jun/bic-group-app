import React from 'react';
import {View, StyleSheet} from 'react-native';
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

export interface CommentViewProps {
  postId: string;
  parentCommentId?: string;
  commentData: IReaction;
  onPressReply: (data: IReaction) => void;
  contentBackgroundColor?: string;
}

const CommentView: React.FC<CommentViewProps> = ({
  postId,
  parentCommentId,
  commentData,
  onPressReply,
  contentBackgroundColor,
}: CommentViewProps) => {
  const {t} = useBaseHook();
  const dispatch = useDispatch();
  const theme: ITheme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  const userId = useUserIdAuth();

  const comment = useKeySelector(postKeySelector.commentById(commentData?.id));
  const {id, data, created_at, user, children_counts, own_children} =
    comment || commentData || {};
  const {content} = data || {};
  const avatar = user?.data?.avatarUrl || '';
  const name = user?.data?.fullname || '';

  let postTime = '';
  if (created_at) {
    postTime = countTime(created_at);
  }

  const onPressUser = () => {
    alert('onPressUser: ' + user?.id);
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
        userId: userId,
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
        ownReaction: {},
        reactionCounts: children_counts,
        userId: userId,
      };
      dispatch(postActions.deleteReactToComment(payload));
      alert(reactionId);
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
    console.log('\x1b[31m', '🐣️  | _onPressReply : ', '\x1b[0m');
    onPressReply?.(commentData);
  };

  return (
    <View>
      <View style={styles.container}>
        <Avatar source={avatar} />
        <View style={{flex: 1, marginLeft: spacing?.margin.small}}>
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
      alignItems: 'center',
    },
    buttonReply: {
      marginRight: spacing?.margin.tiny,
      marginVertical: spacing?.margin.base,
    },
  });
};

export default CommentView;
