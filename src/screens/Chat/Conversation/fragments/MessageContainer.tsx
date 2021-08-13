import React from 'react';
import {StyleSheet, View} from 'react-native';
import {MessageProps} from 'react-native-gifted-chat';
import {isSameDay, isSameUser} from 'react-native-gifted-chat/lib/utils';
import {useTheme} from 'react-native-paper';

import Avatar from '~/beinComponents/Avatar';
import {Text, ViewSpacing} from '~/components';
import {IObject} from '~/interfaces/common';
import {GMessage, IMessage} from '~/interfaces/IChat';
import images from '~/resources/images';
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

  const _currentMessage = currentMessage as IMessage;
  const _previousMessage = previousMessage as IMessage;
  const sameUser =
    _currentMessage?.user?.username === _previousMessage?.user?.username;
  const sameType = _currentMessage?.type === _previousMessage?.type;

  const sameUserInPrevMessage =
    currentMessage && sameUser && isSameDay(currentMessage, previousMessage);

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
            <Avatar.Medium
              source={_currentMessage.user.avatar}
              placeholderSource={images.img_user_avatar_default}
            />
            <View style={styles.viewHeaderInfo}>
              <Text.BodyM style={styles.textName}>
                {_currentMessage?.user.name}
              </Text.BodyM>
              <Text.BodyS style={styles.textTime}>
                {countTime(_currentMessage?._updatedAt)}
              </Text.BodyS>
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
      paddingLeft: spacing.padding.tiny,
      marginTop: -2,
      marginBottom: spacing.margin.base,
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
      marginStart: 44,
      paddingHorizontal: spacing.padding.small,
    },
  });
};

export default MessageContainer;
