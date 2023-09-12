import notificationApi from '~/api/NotificationApi';
import { INotificationItemMenuStore } from '../index';

const getSeperateNotificationSettings = (set, _get) => async (targetId: string) => {
  if (!targetId) return;
  try {
    set((state: INotificationItemMenuStore) => {
      state.loading = true;
    }, 'getSeperateNotificationSettingsLoading');

    const response = await notificationApi.getSpecificNotificationSettings(targetId);

    set((state: INotificationItemMenuStore) => {
      state.loading = false;
      state.enableNotificationSettings = response?.data?.enable || false;
    }, 'getSeperateNotificationSettingsSuccess');
  } catch (err) {
    console.error(
      '\x1b[33m', 'get specific noti settings error', err, '\x1b[0m',
    );
    set((state: INotificationItemMenuStore) => {
      state.loading = false;
    }, 'getSeperateNotificationSettingsError');
  }
};

export default getSeperateNotificationSettings;
