import React from 'react';
import { View } from 'react-native';

import BottomSheet from '~/baseComponents/BottomSheet';
import BottomListItem from '~/components/BottomList/BottomListItem';
import useBaseHook from '~/hooks/baseHook';
import useNotificationStore from '../../store';
import INotificationsState from '../../store/Interface';
import useNotificationItemMenu, { INotificationItemMenuStore } from './store';
import { checkHideDeleteOption, getTextFromSpecificNotificationTargetType } from '~/helpers/notification';

export interface NotificationMenuProps {
  menuRef: any;
  onClose: () => void;
  handleRemoveNotification: (id: string) => void;
}

const NotificationMenu = ({
  menuRef,
  onClose,
  handleRemoveNotification,
}:NotificationMenuProps) => {
  const { t } = useBaseHook();
  const notiActions = useNotificationStore((state: INotificationsState) => state.actions);
  const enableSettings = useNotificationItemMenu((
    state: INotificationItemMenuStore,
  ) => state.enableNotificationSettings);
  const specifictNotiActions = useNotificationItemMenu((state: INotificationItemMenuStore) => state.actions);
  const notificationId = useNotificationItemMenu((
    state: INotificationItemMenuStore,
  ) => state.selectedNotificationId);
  const isRead = useNotificationItemMenu((state: INotificationItemMenuStore) => state.isRead);
  const type = useNotificationItemMenu((state: INotificationItemMenuStore) => state.notificationType);
  const targetType = useNotificationItemMenu((state: INotificationItemMenuStore) => state.targetType);
  const targetId = useNotificationItemMenu((state: INotificationItemMenuStore) => state.targetId);
  const loading = useNotificationItemMenu((state: INotificationItemMenuStore) => state.loading);
  const reset = useNotificationItemMenu((state: INotificationItemMenuStore) => state.reset);

  const handleMarkNotification = () => {
    if (!isRead) {
      notiActions.markAsRead(notificationId);
    } else {
      notiActions.markAsUnRead(notificationId);
    }
    onClose();
    reset();
  };

  const updateSepecificNotificationSettings = () => {
    specifictNotiActions.editNotificationSettings(
      targetId, !enableSettings,
    );
    onClose();
    reset();
  };

  const onRemoveNotification = () => {
    handleRemoveNotification(notificationId);
    onClose();
    reset();
  };

  const isHideDeleteOption = checkHideDeleteOption(type);
  const specificText = getTextFromSpecificNotificationTargetType(targetType, enableSettings);

  const renderListData = () => (
    <View>
      <BottomListItem
        testID="notification.mark_notification_read_or_unread"
        leftIcon="MessageCheck"
        title={t(!isRead ? 'notification:mark_as_read' : 'notification:mark_as_unread')}
        onPress={handleMarkNotification}
      />
      {!Boolean(isHideDeleteOption) && (
        <BottomListItem
          testID="notification.remove_notification"
          leftIcon="TrashCan"
          title={t('notification:text_remove_notification')}
          onPress={onRemoveNotification}
        />
      )}
      {Boolean(specificText) && Boolean(targetId) && (
      <BottomListItem
        testID="notification.specific_notification_settings"
        loading={loading}
        leftIcon={enableSettings ? 'BellSlash' : 'Bell'}
        title={specificText}
        onPress={updateSepecificNotificationSettings}
      />
      )}
    </View>
  );

  return (
    <BottomSheet
      modalizeRef={menuRef}
      ContentComponent={renderListData()}
    />
  );
};

export default NotificationMenu;
