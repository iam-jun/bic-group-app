import moment from 'moment';
import React, {useState} from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Div from '~/beinComponents/Div';
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
  onLongPress: (item: IMessage, position: {x: number; y: number}) => void;
}

const MessageItem = (props: MessageItemProps) => {
  const dispatch = useDispatch();
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);
  const [menuVisible, setMenuVisible] = useState(false);
  const {previousMessage, currentMessage, onLongPress} = props;
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

  const onHover = () => {
    !menuVisible && setMenuVisible(true);
  };

  const onBlur = () => {
    menuVisible && setMenuVisible(false);
  };

  return (
    <Div className="chat-message" onMouseOver={onHover} onMouseLeave={onBlur}>
      <TouchableWithoutFeedback onLongPress={onMenuPress}>
        <View style={styles.container}>
          {quoted_message && <QuotedMessage {...quoted_message} />}
          {!hideHeader && (
            <MessageHeader
              user={user}
              _updatedAt={_updatedAt}
              menuVisible={!removed && menuVisible}
              onMenuPress={onMenuPress}
            />
          )}

          <View style={styles.message}>
            {removed ? (
              <Text useI18n style={styles.removedText}>
                {text}
              </Text>
            ) : (
              <>
                <AttachmentView {...currentMessage} />
                <MarkdownView limitMarkdownTypes>{text}</MarkdownView>
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
      marginBottom: spacing.margin.base,
    },
    message: {
      marginStart: 48,
      marginTop: -16,
      minHeight: 24,
      paddingVertical: 2,
    },
    removedText: {
      color: colors.textSecondary,
      fontStyle: 'italic',
    },
  });
};

export default MessageItem;
