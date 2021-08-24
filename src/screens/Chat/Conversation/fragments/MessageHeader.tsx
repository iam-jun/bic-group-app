import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import Avatar from '~/beinComponents/Avatar';
import {Text} from '~/components';
import {IChatUser} from '~/interfaces/IChat';
import images from '~/resources/images';
import {ITheme} from '~/theme/interfaces';
import {formatDate} from '~/utils/formatData';

interface Props {
  user: IChatUser;
  _updatedAt: string;
}

const MessageHeader: React.FC<Props> = ({user, _updatedAt}: Props) => {
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Avatar.Medium
        source={user.avatar}
        placeholderSource={images.img_user_avatar_default}
      />
      <View style={styles.viewHeaderInfo}>
        <Text.BodyM style={styles.textName}>{user.name}</Text.BodyM>
        <Text.BodyS style={styles.textTime}>
          {formatDate(_updatedAt)}
        </Text.BodyS>
      </View>
    </View>
  );
};

const createStyles = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    viewHeaderInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: spacing.padding.base,
      marginBottom: spacing.margin.base,
    },

    textName: {
      textTransform: 'capitalize',
    },
    textTime: {
      color: colors.textSecondary,
      marginStart: spacing.margin.small,
    },
  });
};

export default MessageHeader;
