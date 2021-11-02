import i18next from 'i18next';
import {isEmpty} from 'lodash';
import moment from 'moment';
import React, {useCallback, useEffect, useState} from 'react';
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
import LinkPreviewer from '~/beinComponents/LinkPreviewer';
import MarkdownView from '~/beinComponents/MarkdownView';
import ReactionView from '~/beinComponents/ReactionView';
import {Text} from '~/components';
import {ReactionType} from '~/constants/reactions';
import useChat from '~/hooks/chat';
import {useRootNavigation} from '~/hooks/navigation';
import {IMessage} from '~/interfaces/IChat';
import {IPayloadReactionDetailBottomSheet} from '~/interfaces/IModal';
import {IReactionCounts} from '~/interfaces/IPost';
import mainStack from '~/router/navigator/MainStack/stack';
import {
  getMessageAttachmentUrl,
  getReactionStatistics,
} from '~/screens/Chat/helper';
import * as modalActions from '~/store/modal/actions';
import {ITheme} from '~/theme/interfaces';
import actions from '../../redux/actions';
import {
  MessageHeader,
  MessageMenu,
  MessageSeparator,
  MessageStatus,
  QuotedMessage,
  SystemMessage,
} from './components';
import AttachmentView from './components/AttachmentView';

export interface MessageItemProps {
  previousMessage: IMessage;
  currentMessage: IMessage;
  index: number;
  onReactPress: (
    event: any,
    item: IMessage,
    side: 'left' | 'right' | 'center',
  ) => void;
  onReplyPress: (item: IMessage) => void;
  onLongPress: (item: IMessage, position: {x: number; y: number}) => void;
  onQuotedMessagePress: (msgId: string) => void;
}

const _MessageItem = (props: MessageItemProps) => {
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();

  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);
  const {messages, attachmentMedia} = useChat();
  const {
    previousMessage,
    currentMessage,
    onReactPress,
    onReplyPress,
    onLongPress,
    onQuotedMessagePress,
  } = props;
  const {
    _id,
    text,
    system,
    removed,
    quotedMessage,
    user,
    createdAt,
    status,
    type,
    reaction_counts,
    own_reactions,
  } = currentMessage;

  const sameUser = user?.username === previousMessage?.user?.username;
  const sameType = type === previousMessage?.type;

  const mediaSource: any = [];
  attachmentMedia?.map?.((item: any) => {
    mediaSource.push({
      uri: getMessageAttachmentUrl(item?.path),
      title: item?.name,
      width: item?.identify?.size?.width,
      height: item?.identify?.size?.height,
    });
  });

  const minutes = moment(createdAt).diff(previousMessage.createdAt, 'minutes');
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
        // clear params after jump to message
        rootNavigation.setParams({
          message_id: undefined,
        });
      }, 2000);
    }
  }, [messages.jumpedMessage]);

  const _onLongPress = useCallback(
    (e: any) => {
      onLongPress?.(currentMessage, {x: e?.pageX, y: e?.pageY});
    },
    [currentMessage],
  );

  const onMenuPress = (e: any) => {
    if (removed) return;
    _onLongPress(e);
  };

  const onMentionPress = useCallback((user: any) => {
    if (!!user?.id) {
      rootNavigation.navigate(mainStack.userProfile, {
        userId: user.id,
      });
    }
  }, []);

  const onAddReaction = (reactionId: ReactionType) => {
    dispatch(
      actions.reactMessage({
        emoji: reactionId,
        messageId: _id,
        shouldReact: true,
      }),
    );
  };

  const onRemoveReaction = (reactionId: ReactionType) => {
    dispatch(
      actions.reactMessage({
        emoji: reactionId,
        messageId: _id,
        shouldReact: false,
      }),
    );
  };

  const onLongPressReaction = (
    reactionType: ReactionType,
    reactionCounts?: IReactionCounts,
  ) => {
    if (reactionCounts) {
      const payload: IPayloadReactionDetailBottomSheet = {
        isOpen: true,
        reactionCounts: reactionCounts,
        initReaction: reactionType,
        getDataParam: {messageId: _id},
        getDataPromise: getReactionStatistics,
      };
      dispatch(modalActions.showReactionDetailBottomSheet(payload));
    }
  };

  const _onReactPress = (event: any) => {
    onReactPress(event, currentMessage, 'left');
  };

  const onPressSelectReaction = (event: any) => {
    onReactPress(event, currentMessage, 'center');
  };

  const _onReplyPress = () => onReplyPress(currentMessage);

  const _onQuotedMessagePress = useCallback(() => {
    if (quotedMessage?.msgId) onQuotedMessagePress(quotedMessage?.msgId);
  }, []);

  const renderMessage = () => {
    return (
      <Div className="chat-message">
        <MessageSeparator
          previousTime={previousMessage.createdAt}
          time={currentMessage.createdAt}
        />
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
                onPress={_onQuotedMessagePress}
              />
            )}
            {!hideHeader && <MessageHeader user={user} createdAt={createdAt} />}
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
                        key={`${_id}_attachment_${attach?.msgId}_${attach?.ts}_${i}`}
                        {...currentMessage}
                        attachment={attach}
                        attachmentMedia={mediaSource}
                        onLongPress={_onLongPress}
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
                    onReactPress={_onReactPress}
                    onReplyPress={_onReplyPress}
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
                  onPressSelectReaction={onPressSelectReaction}
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

const MessageItem = React.memo(_MessageItem);
MessageItem.whyDidYouRender = true;

export default MessageItem;
