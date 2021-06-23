import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {IObject} from '~/interfaces/common';
import {IMessage} from '~/store/chat/interfaces';
import {Text} from '~/theme/components';
import Avatar from '~/theme/components/Image/Avatar';
import {spacing} from '~/theme/configs';
import {generateAvatar} from '~/utils/common';

const QuotedMessage: React.FC<IMessage> = ({user, text, attachments}) => {
  const theme: IObject<any> = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.connector} />
      <View style={styles.right}>
        <Avatar style={styles.avatar} size="small" user={user} />
        <Text style={styles.textWrapper} bold>
          {`${user?.name}  `}
        </Text>
        <Text h6 numberOfLines={1} ellipsizeMode="tail" style={styles.quote}>
          {text ||
            ((attachments || []).length > 0 ? 'tap to see attachment' : '')}
        </Text>
      </View>
    </View>
  );
};
const createStyles = (theme: IObject<any>) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    connector: {
      height: 16,
      width: 20,
      marginLeft: 20,
      borderColor: colors.grey4,
      borderTopWidth: 2,
      borderLeftWidth: 2,
      borderTopLeftRadius: 10,
    },
    right: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.margin.small,
      flexShrink: 1,
    },
    avatar: {
      marginLeft: spacing.margin.small,
    },
    textWrapper: {
      marginLeft: spacing.margin.small,
      textTransform: 'capitalize',
    },
    text: {},
    quote: {
      color: colors.grey4,
      flexShrink: 1,
    },
  });
};

export default QuotedMessage;
