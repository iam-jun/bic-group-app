import React from 'react';
import {Platform, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import Text from '~/beinComponents/Text';
import {useRootNavigation} from '~/hooks/navigation';
import {IMessage} from '~/interfaces/IChat';
import mainStack from '~/router/navigator/MainStack/stack';
import modalActions from '~/store/modal/actions';
import {ITheme} from '~/theme/interfaces';

const SystemMessage: React.FC<IMessage> = (currentMessage: IMessage) => {
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);
  const {rootNavigation} = useRootNavigation();
  const dispatch = useDispatch();

  const {text, user, msg} = currentMessage;

  const onPressUser = (username: string) => {
    const payload = {
      userId: username,
      params: {
        type: 'username',
      },
    };

    if (Platform.OS === 'web') {
      rootNavigation.navigate(mainStack.userProfile, payload);
    } else {
      dispatch(modalActions.showUserProfilePreviewBottomSheet(payload));
    }
  };

  const renderAddRemoveUser = () => {
    const content = text?.replace('{1}', '');

    return (
      <>
        <TouchableOpacity onPress={() => msg && onPressUser(msg)}>
          <Text.BodyM style={styles.textBold}>{msg}</Text.BodyM>
        </TouchableOpacity>
        {content}
      </>
    );
  };

  const renderChangeDescOrAnnounceOrAvatar = () => {
    const content = text?.replace('{0}', '');

    return (
      <>
        <TouchableOpacity onPress={() => onPressUser(user.username)}>
          <Text.BodyM style={styles.textBold}>{user.name}</Text.BodyM>
        </TouchableOpacity>
        {content}
      </>
    );
  };

  const renderChangeTopicOrChatName = () => {
    const content = text?.replace(/{(0|1)}/g, '');

    return (
      <>
        <TouchableOpacity onPress={() => onPressUser(user.username)}>
          <Text.BodyM style={styles.textBold}>{user.name}</Text.BodyM>
        </TouchableOpacity>
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
    switch (currentMessage.type) {
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

  return <Text.BodyS style={styles.container}>{renderContent()}</Text.BodyS>;
};

const createStyles = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      paddingHorizontal: spacing.padding.base,
      paddingBottom: spacing.padding.small,
      color: colors.textSecondary,
    },
    textBold: {
      fontWeight: '700',
    },
  });
};

export default SystemMessage;
