import React from 'react';
import {Image, Platform, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import Avatar from '~/beinComponents/Avatar';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Text from '~/beinComponents/Text';
import {useRootNavigation} from '~/hooks/navigation';
import {IChatUser} from '~/interfaces/IChat';
import mainStack from '~/router/navigator/MainStack/stack';
import {ITheme} from '~/theme/interfaces';
import {formatDate} from '~/utils/formatData';
import {getDefaultAvatar} from '../helper';

interface Props {
  user: IChatUser;
  _updatedAt: string;
}

const MessageHeader: React.FC<Props> = ({user, _updatedAt}: Props) => {
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);
  const {rootNavigation} = useRootNavigation();

  const goProfile = () => {
    rootNavigation.navigate(mainStack.userProfile, {
      userId: user.username,
      params: {
        type: 'username',
      },
    });
  };

  return (
    <View style={styles.container}>
      <ButtonWrapper style={styles.avatarContainer} onPress={goProfile}>
        <Avatar.Medium
          source={user?.avatar}
          cache={false}
          placeholderSource={getDefaultAvatar(user.name)}
          ImageComponent={Image}
        />
      </ButtonWrapper>
      <View style={styles.viewHeaderInfo}>
        <Text.BodyM style={styles.textName}>{user?.name}</Text.BodyM>
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
    avatarContainer: {
      paddingTop:
        Platform.OS !== 'web' ? spacing.padding.small : spacing.padding.tiny,
      paddingBottom: Platform.OS !== 'web' ? 0 : 2,
    },
    viewHeaderInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: spacing.padding.base,
    },
    textName: {
      textTransform: 'capitalize',
    },
    textTime: {
      color: colors.textSecondary,
      marginStart: spacing.margin.small,
    },
    iconMenu: {
      marginStart: spacing.margin.small,
      marginTop: spacing.margin.tiny,
    },
  });
};

export default MessageHeader;
