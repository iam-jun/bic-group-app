import notificationApi from '~/api/NotificationApi';
import { INotificationItemMenuStore } from '../index';

const editNotificationSettings = (set, _get) => async (targetId: string, enable: boolean) => {
  try {
    set((state: INotificationItemMenuStore) => {
      state.enableNotificationSettings = enable;
    }, 'editNotificationSettingsLoading');

    await notificationApi.editSpecificNotificationSettings(targetId, enable);
  } catch (err) {
    console.error(
      '\x1b[33m', 'edit specific noti settings error', err, '\x1b[0m',
    );
  }
};

export default editNotificationSettings;
