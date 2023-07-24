import { cloneDeep } from 'lodash';
import INotificationsState from '../Interface';

const undoDeleteNotificationLocal = (set, get) => (notificationId: string) => {
  try {
    if (!notificationId) return;
    const notification = get()?.notificationList?.[notificationId] || {};
    const { waitingForDelete }: INotificationsState = get();
    const newWaitingForDelete = cloneDeep(waitingForDelete);
    const index = newWaitingForDelete?.indexOf(notificationId);
    if (index > -1) {
      newWaitingForDelete?.splice(index, 1);
    }
    const newNotification = { ...notification, deleted: false };

    set((state: INotificationsState) => {
      state.unseenNumber = 0;
      state.notificationList = { ...state.notificationList, [notificationId]: newNotification };
      state.waitingForDelete = newWaitingForDelete;
    }, 'undoDeleteNotificationLocal');
  } catch (err) {
    console.error(
      '\x1b[33m', 'delete notification local error', err, '\x1b[0m',
    );
  }
};

export default undoDeleteNotificationLocal;
