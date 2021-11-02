import React, {FC, useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {ITheme} from '~/theme/interfaces';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import * as modalActions from '~/store/modal/actions';
import {IAction} from '~/constants/commonActions';

export interface ConversationItemMenuProps {
  conversationId: string;
}

const ConversationItemMenu: FC<ConversationItemMenuProps> = ({
  conversationId,
}: ConversationItemMenuProps) => {
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyle(theme);
  console.log(`conversationId`, conversationId);

  const dispatch = useDispatch();

  const showAlertNewFeature = () => {
    dispatch(modalActions.hideModal());
    dispatch(modalActions.showAlertNewFeature());
  };

  const onPressNotificationToggle = (action: IAction) => {
    console.log(`action`, action);
    alert('Notification toggle pressed, ' + action);
  };

  return (
    <View style={styles.container}>
      <PrimaryItem
        style={styles.item}
        leftIcon={'Bell'}
        leftIconProps={{icon: 'Bell', size: 24}}
        title={'chat:conversation_options:notifications'}
        titleProps={{useI18n: true}}
        onPressToggle={onPressNotificationToggle}
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
