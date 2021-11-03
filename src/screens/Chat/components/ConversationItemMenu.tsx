import React, {FC, useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {ITheme} from '~/theme/interfaces';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import * as modalActions from '~/store/modal/actions';
import commonActions, {IAction} from '~/constants/commonActions';
import chatActions from '~/screens/Chat/redux/actions';

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

  const onPressNotificationToggle = (action: IAction) => {
    if (action === commonActions.checkBox) {
      dispatch(
        chatActions.turnOnConversationNotifications({roomId: conversationId}),
      );
      setIsMute(false);
    } else if (action === commonActions.uncheckBox) {
      dispatch(
        chatActions.turnOffConversationNotifications({roomId: conversationId}),
      );
      setIsMute(true);
    }
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
