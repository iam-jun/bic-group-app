import moment from 'moment';
import React from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Div from '~/beinComponents/Div';
import MarkdownView from '~/beinComponents/MarkdownView';
import {Text} from '~/components';
import {useRootNavigation} from '~/hooks/navigation';
import {IMessage} from '~/interfaces/IChat';
import mainStack from '~/router/navigator/MainStack/stack';
import {ITheme} from '~/theme/interfaces';
import actions from '../../redux/actions';
import AttachmentView from './AttachmentView';
import MessageHeader from './MessageHeader';
import MessageMenu from './MessageMenu';
import MessageStatus from './MessageStatus';
import QuotedMessage from './QuotedMessage';
import SystemMessage from './SystemMessage';

export interface MessageItemProps {
  previousMessage: IMessage;
  currentMessage: IMessage;
  onReactPress: (item: IMessage) => void;
  onReplyPress: (item: IMessage) => void;
  onLongPress: (item: IMessage, position: {x: number; y: number}) => void;
}

const MessageItem = (props: MessageItemProps) => {
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();

  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);
  const {
    previousMessage,
    currentMessage,
    onReactPress,
    onReplyPress,
    onLongPress,
  } = props;
  const {
    text,
    system,
    removed,
    quoted_message,
    user,
    _updatedAt,
    status,
    type,
  } = currentMessage;

  const sameUser = user?.username === previousMessage?.user?.username;
  const sameType = type === previousMessage?.type;

  const minutes = moment(_updatedAt).diff(
    previousMessage._updatedAt,
    'minutes',
  );
  const sameDay = minutes <= 5;

  const _onRetryPress = () => {
    dispatch(actions.retrySendMessage(currentMessage));
  };

  const hideHeader = previousMessage && sameUser && sameType && sameDay;

  if (system) return <SystemMessage {...currentMessage} />;

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

  return (
    <Div className="chat-message">
      <TouchableWithoutFeedback onLongPress={onMenuPress}>
        <View style={styles.container}>
          {quoted_message && <QuotedMessage {...quoted_message} />}
          {!hideHeader && <MessageHeader user={user} _updatedAt={_updatedAt} />}

          <View
            style={[styles.message, !hideHeader && styles.messageWithHeader]}>
            {removed ? (
              <Text useI18n style={styles.removedText}>
                {text}
              </Text>
            ) : (
              <>
                <AttachmentView {...currentMessage} />
                <MarkdownView
                  limitMarkdownTypes
                  onPressAudience={onMentionPress}>
                  {text}
                </MarkdownView>
                <MessageMenu
                  onReactPress={() => onReactPress(currentMessage)}
                  onReplyPress={() => onReplyPress(currentMessage)}
                  onMenuPress={onMenuPress}
                />
              </>
            )}
          </View>
          <MessageStatus status={status} onRetryPress={_onRetryPress} />
        </View>
      </TouchableWithoutFeedback>
    </Div>
  );
};

const createStyles = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      paddingHorizontal: spacing.padding.base,
    },
    messageWithHeader: {
      marginTop: -20, // push message up so that it is right below the user's name
    },
    message: {
      marginStart: 48,
    },
    removedText: {
      color: colors.textSecondary,
      fontStyle: 'italic',
    },
  });
};

export default MessageItem;
