import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Avatar from '~/beinComponents/Avatar';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Text from '~/beinComponents/Text';
import {IChatUser} from '~/interfaces/IChat';
import modalActions from '~/store/modal/actions';
import {ITheme} from '~/theme/interfaces';
import {formatDate} from '~/utils/formatData';
import {getDefaultAvatar} from '../../../helper';

interface Props {
  user: IChatUser;
  _updatedAt: string;
}

const MessageHeader: React.FC<Props> = ({user, _updatedAt}: Props) => {
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);
  const dispatch = useDispatch();

  const onPressUser = (e: any) => {
    const payload = {
      userId: user.username,
      position: {x: e?.pageX, y: e?.pageY},
      params: {
        type: 'username',
      },
    };
    dispatch(modalActions.showUserProfilePreviewBottomSheet(payload));
  };

  return (
    <View style={styles.container}>
      <ButtonWrapper style={styles.avatarContainer} onPress={onPressUser}>
        <Avatar.Medium
          source={{
            uri: user?.avatar,
            cache: 'web',
          }}
          cache={false}
          placeholderSource={getDefaultAvatar(user?.name)}
        />
      </ButtonWrapper>
      <View style={styles.viewHeaderInfo}>
        <ButtonWrapper onPress={onPressUser}>
          <Text.BodyM style={styles.textName}>{user?.name}</Text.BodyM>
        </ButtonWrapper>
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
