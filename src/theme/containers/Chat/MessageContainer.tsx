import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {MessageProps} from 'react-native-gifted-chat';
import {IObject} from '~/interfaces/common';
import {Text, ViewSpacing} from '~/theme/components';
import ChatBubble from './ChatBubble';
import {isSameDay, isSameUser} from 'react-native-gifted-chat/lib/utils';
import Avatar from '~/theme/components/Image/Avatar';
import {formatDate} from '~/utils/format';
import {sizes} from '~/theme/configs/dimension';
import {spacing} from '~/theme/configs';
import Reactions from './Reactions';
import QuotedMessage from './QuotedMessage';
import {IMessage} from '~/store/chat/interfaces';

const MessageContainer: React.FC<MessageProps<IMessage>> = props => {
  const theme: IObject<any> = useTheme();
  const styles = createStyles(theme);
  const {currentMessage, previousMessage} = props;

  var sameUserInPrevMessage =
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
            <Avatar size="base" user={_currentMessage?.user} />
            <View style={styles.viewHeaderInfo}>
              <Text h5 bold colorSecondary style={styles.textName}>
                {_currentMessage?.user.name}
              </Text>
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
