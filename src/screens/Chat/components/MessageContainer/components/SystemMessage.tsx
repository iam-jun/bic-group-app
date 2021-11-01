import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Icon from '~/beinComponents/Icon';

import Text from '~/beinComponents/Text';
import {IMessage} from '~/interfaces/IChat';
import modalActions from '~/store/modal/actions';
import {ITheme} from '~/theme/interfaces';

const SystemMessage: React.FC<IMessage> = (currentMessage: IMessage) => {
  if (
    currentMessage.type?.includes('role') ||
    currentMessage.type === 'room_changed_avatar'
  )
    return null;

  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);
  const dispatch = useDispatch();

  const {text, type: messageType, user, msg} = currentMessage;

  const onPressUser = (e: any, username?: string) => {
    if (!username) return;

    const payload = {
      userId: username,
      position: {x: e?.pageX, y: e?.pageY},
      params: {
        type: 'username',
      },
    };
    dispatch(modalActions.showUserProfilePreviewBottomSheet(payload));
  };

  const renderAddRemoveUser = () => {
    const content = text?.replace('{1}', '');
    const username = msg;

    return (
      <>
        <Text.BodyM
          onPress={(e: any) => msg && onPressUser(e, username)}
          style={styles.textBold}>
          {username}
        </Text.BodyM>
        {content}
      </>
    );
  };

  const renderChangeDescOrAnnounceOrAvatar = () => {
    const content = text?.replace('{0}', '');

    return (
      <>
        <Text.BodyM
          style={styles.textBold}
          onPress={(e: any) => onPressUser(e, user.username)}>
          {user.name}
        </Text.BodyM>
        {content}
      </>
    );
  };

  const renderChangeTopicOrChatName = () => {
    const content = text?.replace(/{(0|1)}/g, '');

    return (
      <>
        <Text.BodyM
          onPress={(e: any) => onPressUser(e, user.username)}
          style={styles.textBold}>
          {user.name}
        </Text.BodyM>
        {content}
        <Text.BodyM style={styles.textBold}>{msg}</Text.BodyM>
      </>
    );
  };

  const renderContent = () => {
    /*
    Switch cases base on message type
    Too see more types, look up in en.json > chat > system_message
    */
    switch (messageType) {
      case 'au':
      case 'ru':
        return renderAddRemoveUser();
      case 'room_changed_description':
      case 'room_changed_announcement':
      case 'room_changed_avatar':
        return renderChangeDescOrAnnounceOrAvatar();
      case 'room_changed_topic':
      case 'r':
        return renderChangeTopicOrChatName();
      default:
        return text;
    }
  };

  const renderIcon = () => {
    const baseSize = 24;

    switch (messageType) {
      case 'au':
        return (
          <Icon
            icon={'ArrowRight'}
            tintColor={theme.colors.primary6}
            size={baseSize}
            style={styles.icon}
          />
        );
      case 'ru':
        return (
          <Icon
            icon={'ArrowLeft'}
            tintColor={theme.colors.textSecondary}
            size={baseSize}
            style={styles.icon}
          />
        );
      default:
        return (
          <Icon
            icon={'Star'}
            tintColor={theme.colors.primary6}
            size={baseSize}
            style={styles.icon}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      {renderIcon()}
      <Text.BodyS style={styles.text}>{renderContent()}</Text.BodyS>
    </View>
  );
};

const createStyles = (theme: ITheme) => {
  const {colors, spacing} = theme;
  const defaultPaddingVertical = spacing.padding.base
    ? spacing.padding.base / 2
    : 6;

  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Platform.OS !== 'web' ? defaultPaddingVertical : 0,
      paddingHorizontal: spacing.padding.base,
    },
    icon: {
      marginTop: Platform.OS === 'web' ? spacing.margin.tiny : 0,
      marginHorizontal: spacing.margin.base,
    },
    text: {
      color: colors.textSecondary,
    },
    textBold: {
      fontWeight: '700',
    },
  });
};

export default SystemMessage;
