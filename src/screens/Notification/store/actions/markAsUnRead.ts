import { cloneDeep } from 'lodash';
import notificationApi from '~/api/NotificationApi';
import INotificationsState from '../Interface';

const markAsUnRead = (set, get) => async (notificationId:string) => {
  try {
    if (!notificationId) return;

    await notificationApi.markAsUnRead(notificationId);
    const data: INotificationsState = get();

    // get all notifications from store
    const notifications: any = cloneDeep(data.notificationList) || {};
    notifications[notificationId].isRead = false;

    // finally, set notification back to store,
    set((state: INotificationsState) => {
      state.notificationList = { ...notifications };
    }, 'markAsUnReadSuccess');
  } catch (err) {
    console.error(
      '\x1b[33m', 'notification markAsUnRead error', err, '\x1b[0m',
    );
  }
};

export default markAsUnRead;
