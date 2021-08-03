import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {MessageProps} from 'react-native-gifted-chat';
import {IObject} from '~/interfaces/common';
import {Text, ViewSpacing} from '~/components';
import ChatBubble from './ChatBubble';
import {isSameDay, isSameUser} from 'react-native-gifted-chat/lib/utils';
import {formatDate} from '~/utils/formatData';
import {sizes} from '~/theme/dimension';
import {spacing} from '~/theme';
import Reactions from './Reactions';
import QuotedMessage from './QuotedMessage';
import {GMessage, IMessage} from '~/interfaces/IChat';
import Avatar from '~/beinComponents/Avatar';
import SystemMessage from './SystemMessage';

const MessageContainer: React.FC<MessageProps<GMessage>> = (
  props: MessageProps<GMessage>,
) => {
  const theme: IObject<any> = useTheme();
  const styles = createStyles(theme);
  const {currentMessage, previousMessage, nextMessage} = props;

  if (currentMessage?.system) return <SystemMessage {...currentMessage} />;

  const sameUserInPrevMessage =
    isSameUser(currentMessage || ({} as IMessage), previousMessage) &&
    isSameDay(currentMessage || ({} as IMessage), previousMessage);
  const _currentMessage = currentMessage as IMessage;
  const reactions = _currentMessage?.reactions || [];

  return (
    <View style={styles.container}>
      {_currentMessage.quoted_message && (
        <>
          <ViewSpacing height={spacing.margin.large} />
          <QuotedMessage {..._currentMessage.quoted_message} />
        </>
      )}
      {(!sameUserInPrevMessage || _currentMessage.quoted_message) && (
        <>
          {!_currentMessage.quoted_message && (
            <ViewSpacing height={spacing.margin.base} />
          )}
          <View style={styles.viewHeader}>
            <Avatar.Medium source={_currentMessage.user.avatar} />
            <View style={styles.viewHeaderInfo}>
              <Text.H5 style={styles.textName}>
                {_currentMessage?.user.name}
              </Text.H5>
              <Text style={styles.textTime}>
                {formatDate(_currentMessage?.createdAt)}
              </Text>
            </View>
          </View>
          <ViewSpacing height={spacing.margin.base} />
        </>
      )}
      <ChatBubble {...props} />
      <View style={styles.reactions}>
        {reactions?.length > 0 && (
          <Reactions data={reactions} onPress={() => {}} />
        )}
      </View>
      {!nextMessage && <ViewSpacing height={spacing.margin.large} />}
    </View>
  );
};

const createStyles = (theme: IObject<any>) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      paddingHorizontal: spacing.padding.base,
      paddingBottom: spacing.padding.base,
    },
    viewHeader: {
      flexDirection: 'row',
      marginBottom: -32,
      alignItems: 'flex-start',
    },
    viewHeaderInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 37,
      height: 37,
      borderRadius: 100,
    },
    text: {
      fontSize: sizes.base,
      color: colors.text,
    },
    textName: {
      marginStart: spacing.margin.small,
      textTransform: 'capitalize',
    },
    textTime: {
      fontSize: 10,
      color: colors.grey6,
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
