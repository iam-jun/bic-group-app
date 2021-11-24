import React, {FC, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import chatActions from '~/screens/Chat/redux/actions';
import * as modalActions from '~/store/modal/actions';
import {ITheme} from '~/theme/interfaces';

export interface ConversationItemMenuProps {
  conversationId: string;
  disableNotifications?: boolean;
}

const ConversationItemMenu: FC<ConversationItemMenuProps> = ({
  conversationId,
  disableNotifications = false,
}: ConversationItemMenuProps) => {
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyle(theme);
  const [isMute, setIsMute] = useState(disableNotifications);
  const notificationsIcon = isMute ? 'BellSlash' : 'Bell';

  const dispatch = useDispatch();

  const showAlertNewFeature = () => {
    dispatch(modalActions.hideModal());
    dispatch(modalActions.showAlertNewFeature());
  };

  const onPressNotificationToggle = () => {
    dispatch(
      chatActions.toggleConversationNotifications({
        roomId: conversationId,
        currentDisableNotifications: isMute,
      }),
    );
    setIsMute(!isMute);
  };

  return (
    <View style={styles.container}>
      <PrimaryItem
        style={styles.item}
        leftIcon={notificationsIcon}
        leftIconProps={{icon: notificationsIcon, size: 24}}
        title={'chat:conversation_options:notifications'}
        titleProps={{useI18n: true}}
        onPressToggle={onPressNotificationToggle}
        toggleChecked={!isMute}
      />
      <PrimaryItem
        style={styles.item}
        leftIcon={'iconPin'}
        leftIconProps={{icon: 'iconPin', size: 24}}
        title={'chat:conversation_options:pin'}
        titleProps={{useI18n: true}}
        onPress={showAlertNewFeature}
      />
      <PrimaryItem
        style={styles.item}
        leftIcon={'FileTimesAlt'}
        leftIconProps={{icon: 'FileTimesAlt', size: 24}}
        title={'chat:conversation_options:mark_as_read'}
        titleProps={{useI18n: true}}
        onPress={showAlertNewFeature}
      />
      <PrimaryItem
        style={styles.item}
        leftIcon={'TrashAlt'}
        leftIconProps={{icon: 'TrashAlt', size: 24}}
        title={'chat:conversation_options:delete_chat'}
        titleProps={{useI18n: true}}
        onPress={showAlertNewFeature}
      />
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {spacing} = theme;
  return StyleSheet.create({
    container: {
      paddingVertical: spacing.padding.tiny,
    },
    item: {
      height: 44,
      paddingHorizontal: spacing.padding.large,
    },
  });
};

export default ConversationItemMenu;
