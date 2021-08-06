import React from 'react';
import {StyleSheet, View} from 'react-native';
import {MessageProps} from 'react-native-gifted-chat';
import {isSameDay, isSameUser} from 'react-native-gifted-chat/lib/utils';
import {useTheme} from 'react-native-paper';

import Avatar from '~/beinComponents/Avatar';
import {Text, ViewSpacing} from '~/components';
import {IObject} from '~/interfaces/common';
import {GMessage, IMessage} from '~/interfaces/IChat';
import {spacing} from '~/theme';
import {countTime} from '~/utils/formatData';
import ChatBubble from './ChatBubble';
import LoadingMessage from './LoadingMessage';
import MessageStatus from './MessageStatus';
import QuotedMessage from './QuotedMessage';
import Reactions from './Reactions';
import SystemMessage from './SystemMessage';

export interface MessageContainerProps extends Partial<MessageProps<GMessage>> {
  loading?: boolean;
  onRetryPress: (message: IMessage) => void;
}

const MessageContainer: React.FC<MessageContainerProps> = (
  props: MessageContainerProps,
) => {
  const theme: IObject<any> = useTheme();
  const styles = createStyles(theme);
  const {loading, currentMessage, previousMessage, nextMessage, onRetryPress} =
    props;

  if (loading) return <LoadingMessage />;

  if (currentMessage?.system) return <SystemMessage {...currentMessage} />;

  const sameUserInPrevMessage =
    currentMessage &&
    isSameUser(currentMessage, previousMessage) &&
    isSameDay(currentMessage, previousMessage);

  const _currentMessage = currentMessage as IMessage;
  const _previousMessage = previousMessage as IMessage;

  const sameType = _currentMessage?.type === _previousMessage?.type;

  const reactions = _currentMessage?.reactions || [];
  const _onRetryPress = () => onRetryPress(_currentMessage);

  return (
    <View style={styles.container}>
      {_currentMessage.quoted_message && (
        <>
          <ViewSpacing height={spacing.margin.large} />
          <QuotedMessage {..._currentMessage.quoted_message} />
        </>
      )}
      {(!(sameUserInPrevMessage && sameType) ||
        _currentMessage.quoted_message) && (
        <>
          {!_currentMessage.quoted_message && (
            <ViewSpacing height={spacing.margin.large} />
          )}
          <View style={styles.viewHeader}>
            <Avatar.Medium source={_currentMessage.user.avatar} />
            <View style={styles.viewHeaderInfo}>
              <Text.H6 style={styles.textName}>
                {_currentMessage?.user.name}
              </Text.H6>
              <Text.Body style={styles.textTime}>
                {countTime(_currentMessage?._updatedAt)}
              </Text.Body>
            </View>
          </View>
          <ViewSpacing height={spacing.margin.base} />
        </>
      )}
      {
        //@ts-ignore
        <ChatBubble {...props} />
      }
      {/*
          Now only show failed status
        */}
      {_currentMessage.status === 'failed' && (
        <MessageStatus
          status={_currentMessage.status}
          onRetryPress={_onRetryPress}
        />
      )}
      <View style={styles.reactions}>
        {reactions?.length > 0 && (
          <Reactions data={reactions} onPress={() => {}} />
        )}
      </View>
      {(!nextMessage || nextMessage.system) && (
        <ViewSpacing height={spacing.margin.big} />
      )}
    </View>
  );
};

const createStyles = (theme: IObject<any>) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      paddingHorizontal: spacing.padding.base,
    },
    viewHeader: {
      flexDirection: 'row',
      marginBottom: -32, // default gifted chat avatar size
      alignItems: 'flex-start',
    },
    viewHeaderInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    textName: {
      marginStart: spacing.margin.small,
      textTransform: 'capitalize',
    },
    textTime: {
      color: colors.textSecondary,
      marginStart: spacing.margin.small,
    },
    reactions: {
      flexDirection: 'row',
      marginStart: 40,
      paddingHorizontal: spacing.padding.small,
    },
  });
};

export default MessageContainer;
