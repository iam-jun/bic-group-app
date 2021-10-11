import i18next from 'i18next';
import {isEmpty} from 'lodash';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Div from '~/beinComponents/Div';
import Divider from '~/beinComponents/Divider';
import MarkdownView from '~/beinComponents/MarkdownView';
import ReactionView from '~/beinComponents/ReactionView';
import {Text} from '~/components';
import {ReactionType} from '~/constants/reactions';
import useChat from '~/hooks/chat';
import {useRootNavigation} from '~/hooks/navigation';
import {IMessage} from '~/interfaces/IChat';
import mainStack from '~/router/navigator/MainStack/stack';
import {ITheme} from '~/theme/interfaces';
import actions from '../redux/actions';
import AttachmentView from './AttachmentView';
import LinkPreviewer from '~/beinComponents/LinkPreviewer';
import MessageHeader from './MessageHeader';
import MessageMenu from './MessageMenu';
import MessageStatus from './MessageStatus';
import QuotedMessage from './QuotedMessage';
import SystemMessage from './SystemMessage';

export interface MessageItemProps {
  previousMessage: IMessage;
  currentMessage: IMessage;
  index: number;
  onReactPress: (event: any, side: 'left' | 'right' | 'center') => void;
  onReplyPress: () => void;
  onLongPress: (item: IMessage, position: {x: number; y: number}) => void;
  onAddReaction: (reaction: ReactionType) => void;
  onRemoveReaction: (reaction: ReactionType) => void;
  onLongPressReaction: (reactionType: ReactionType) => void;
  onQuotedMessagePress: () => void;
}

const MessageItem = (props: MessageItemProps) => {
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();

  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);
  const {messages} = useChat();
  const {
    previousMessage,
    currentMessage,
    onReactPress,
    onReplyPress,
    onLongPress,
    onAddReaction,
    onRemoveReaction,
    onLongPressReaction,
    onQuotedMessagePress,
  } = props;
  const {
    _id,
    text,
    system,
    removed,
    quotedMessage,
    user,
    _updatedAt,
    status,
    type,
    reaction_counts,
    own_reactions,
  } = currentMessage;

  const sameUser = user?.username === previousMessage?.user?.username;
  const sameType = type === previousMessage?.type;

  const minutes = moment(_updatedAt).diff(
    previousMessage._updatedAt,
    'minutes',
  );
  const within5Mins = minutes <= 5;

  const _onRetryPress = () => {
    dispatch(actions.retrySendMessage(currentMessage));
  };

  const hideHeader =
    !quotedMessage &&
    previousMessage &&
    sameUser &&
    sameType &&
    within5Mins &&
    messages.unreadMessage?._id !== _id;

  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    if (messages.jumpedMessage?._id === _id) {
      setBlinking(true);

      setTimeout(() => {
        dispatch(actions.setJumpedMessage(null));
        setBlinking(false);
      }, 2000);
    }
  }, [messages.jumpedMessage]);

  const onMenuPress = (e: any) => {
    if (removed) return;

    onLongPress?.(currentMessage, {x: e?.pageX, y: e?.pageY});
  };

  const onMentionPress = (user: any) => {
    if (!!user?.id) {
      rootNavigation.navigate(mainStack.userProfile, {
        userId: user.id,
      });
    }
  };

  const renderMessage = () => {
    return (
      <Div className="chat-message">
        <TouchableWithoutFeedback onLongPress={onMenuPress}>
          <View
            style={[
              styles.container,
              !hideHeader && styles.containerWithHeader,
              blinking && styles.blinking,
            ]}>
            {quotedMessage && (
              <QuotedMessage
                message={quotedMessage}
                onPress={onQuotedMessagePress}
              />
            )}
            {!hideHeader && (
              <MessageHeader user={user} _updatedAt={_updatedAt} />
            )}
            <View
              style={[
                styles.messageContainer,
                !hideHeader && styles.messageWithHeader,
              ]}>
              {removed ? (
                <Text useI18n style={styles.removedText}>
                  {text}
                </Text>
              ) : (
                <>
                  {currentMessage?.attachments?.map?.(
                    (attach: any, i: number) => (
                      <AttachmentView
                        key={`${_id}_attachment_${attach?.ts || i}`}
                        {...currentMessage}
                        attachment={attach}
                      />
                    ),
                  )}
                  <View style={styles.textContainer}>
                    <MarkdownView
                      limitMarkdownTypes
                      onPressAudience={onMentionPress}>
                      {text}
                    </MarkdownView>
                    {currentMessage.editedBy && (
                      <Text.Subtitle
                        color={theme.colors.textSecondary}
                        style={styles.editedText}>
                        ({i18next.t('chat:text_edited')})
                      </Text.Subtitle>
                    )}
                  </View>
                  <LinkPreviewer text={text} />
                  <MessageMenu
                    onReactPress={(event: any) => onReactPress(event, 'left')}
                    onReplyPress={() => onReplyPress()}
                    onMenuPress={onMenuPress}
                    hideHeader={hideHeader}
                  />
                </>
              )}
            </View>
            <MessageStatus status={status} onRetryPress={_onRetryPress} />
            {!removed && !isEmpty(reaction_counts) && (
              <View style={styles.reactionView}>
                <ReactionView
                  ownReactions={own_reactions || {}}
                  reactionCounts={reaction_counts || {}}
                  onAddReaction={onAddReaction}
                  onRemoveReaction={onRemoveReaction}
                  onLongPressReaction={onLongPressReaction}
                  onPressSelectReaction={(event: any) =>
                    onReactPress(event, 'center')
                  }
                  showSelectReactionWhenEmpty={false}
                />
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </Div>
    );
  };

  const renderDivider = () => {
    return (
      <View style={styles.divider}>
        <Divider style={styles.dividerLine} color={theme.colors.primary6} />
        <Text style={styles.unreadText} color={theme.colors.primary6} useI18n>
          chat:label_unread_messages
        </Text>
        <Divider style={styles.dividerLine} color={theme.colors.primary6} />
      </View>
    );
  };

  return (
    <View>
      {messages.unreadMessage?._id === _id && renderDivider()}
      {system ? <SystemMessage {...currentMessage} /> : renderMessage()}
    </View>
  );
};

const createStyles = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    containerWithHeader: {
      marginTop:
        Platform.OS !== 'web' ? spacing.margin.small : spacing.margin.base,
    },
    container: {
      paddingHorizontal: spacing.padding.base,
    },
    blinking: {
      backgroundColor: colors.placeholder,
    },
    marginTop: {
      marginTop: spacing.margin.base,
    },
    divider: {
      flexDirection: 'row',
      // marginVertical: spacing.margin.base,
    },
    dividerLine: {
      flex: 1,
      marginTop: 10,
    },
    unreadText: {
      paddingHorizontal: spacing.padding.small,
    },
    messageWithHeader: {
      marginTop: -20, // push message up so that it is right below the user's name
    },
    messageContainer: {
      marginStart: 48,
      minHeight: 28,
    },
    removedText: {
      paddingTop: spacing.padding.tiny,
      color: colors.textSecondary,
      fontStyle: 'italic',
    },
    textContainer: {
      alignItems: 'flex-start',
    },
    reactionView: {
      marginStart: 38,
    },
    editedText: {
      fontStyle: 'italic',
    },
  });
};

export default MessageItem;
