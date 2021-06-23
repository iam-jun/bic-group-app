import React from 'react';
import {View, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {useTheme} from 'react-native-paper';
import {IObject} from '~/interfaces/common';
import {IMessage} from '~/store/chat/interfaces';
import Icon from '~/theme/components/Icon';
import Text from '~/theme/components/Text';
import {spacing} from '~/theme/configs';

interface Props {
  replyingMessage?: IMessage;
  onCancel: () => void;
}

const ChatFooter: React.FC<Props> = ({replyingMessage, onCancel}) => {
  const theme: IObject<any> = useTheme();
  const {colors} = theme;
  const styles = createStyles(theme);
  if (!replyingMessage) return null;

  return (
    <View style={styles.container}>
      <View style={styles.sideBar}></View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text bold style={styles.textUsername}>
            {replyingMessage?.user.name}
          </Text>
          <Icon icon="iconClose" fill={colors.grey4} onPress={onCancel} />
        </View>
        <Text numberOfLines={2} style={styles.textMessage}>
          {replyingMessage?.text}
        </Text>
      </View>
    </View>
  );
};

const createStyles = (theme: IObject<any>) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    content: {
      flexGrow: 1,
    },
    sideBar: {
      width: 10,
      backgroundColor: colors.primary,
    },
    textUsername: {
      textTransform: 'capitalize',
    },
    textMessage: {
      color: colors.grey4,
      paddingLeft: spacing.margin.base,
      marginBottom: spacing.margin.base,
    },
    header: {
      paddingHorizontal: spacing.margin.base,
      paddingVertical: spacing.padding.small,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  });
};

export default ChatFooter;
