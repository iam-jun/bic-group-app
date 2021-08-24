import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import MarkdownView from '~/beinComponents/MarkdownView';
import {Text} from '~/components';
import {IMessage} from '~/interfaces/IChat';
import {ITheme} from '~/theme/interfaces';
import actions from '../../redux/actions';
import AttachmentView from './AttachmentView';
import MessageHeader from './MessageHeader';
import MessageStatus from './MessageStatus';
import QuotedMessage from './QuotedMessage';
import SystemMessage from './SystemMessage';

export interface MessageItemProps {
  previousMessage: IMessage;
  currentMessage: IMessage;
}

const MessageItem = (props: MessageItemProps) => {
  const dispatch = useDispatch();
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);
  const {previousMessage, currentMessage} = props;
  const {text, system, quoted_message, user, _updatedAt, status, type} =
    currentMessage;

  const sameUser = user?.username === previousMessage?.user?.username;
  const sameType = type === previousMessage?.type;

  // && isSameDay(currentMessage, previousMessage);

  const _onRetryPress = () => {
    dispatch(actions.retrySendMessage(currentMessage));
  };

  const showHeader = (sameUser && sameType) || quoted_message;

  if (system) return <SystemMessage {...currentMessage} />;

  return (
    <View style={styles.container}>
      {quoted_message && <QuotedMessage {...quoted_message} />}
      {showHeader && <MessageHeader user={user} _updatedAt={_updatedAt} />}

      <View style={styles.message}>
        <AttachmentView {...currentMessage} />
        <MarkdownView limitMarkdownTypes>{text}</MarkdownView>
      </View>
      <MessageStatus status={status} onRetryPress={_onRetryPress} />
    </View>
  );
};

const createStyles = (theme: ITheme) => {
  const {spacing} = theme;
  return StyleSheet.create({
    container: {
      paddingHorizontal: spacing.padding.base,
      marginBottom: spacing.margin.base,
    },
    message: {
      marginStart: 48,
      marginTop: -16,
    },
  });
};

export default MessageItem;
