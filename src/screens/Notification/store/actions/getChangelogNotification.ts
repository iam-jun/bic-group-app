import { isEmpty } from 'lodash';
import notificationApi from '~/api/NotificationApi';
import INotificationsState from '../Interface';

const getChangelogNotification = (set, _get) => async (notificationId: string) => {
  try {
    if (!notificationId) return;
    set((state: INotificationsState) => {
      state.changelogsInfo = { title: '', content: '' };
      state.changelogsInfoLoading = true;
    }, 'getChangelogNotificationLoading');

    const notification = await notificationApi.getChangelogNotification(notificationId);
    const activity = notification?.data?.activities?.[0] || {};
    if (!isEmpty(activity)) {
      set((state: INotificationsState) => {
        state.changelogsInfo = activity.changelogsInfo || {};
        state.changelogsInfoLoading = false;
      }, 'getChangelogNotificationSuccess');
    }
  } catch (err) {
    console.error(
      '\x1b[33m', 'notification get Changelog error', err, '\x1b[0m',
    );
    set((state: INotificationsState) => {
      state.changelogsInfoLoading = false;
    }, 'getChangelogNotificationError');
  }
};

export default getChangelogNotification;
