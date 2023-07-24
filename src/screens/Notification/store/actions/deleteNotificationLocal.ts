import INotificationsState from '../Interface';

const deleteNotificationLocal = (set, get) => (notificationId: string) => {
  try {
    if (!notificationId) return;
    const notification = get()?.notificationList?.[notificationId] || {};
    const { notificationList, waitingForDelete }: INotificationsState = get();

    const newNotification = { ...notification, deleted: true };
    const newWaitingForDelete = [...waitingForDelete, notificationId];

    set((state: INotificationsState) => {
      state.unseenNumber = 0;
      state.notificationList = { ...notificationList, [notificationId]: newNotification };
      state.waitingForDelete = newWaitingForDelete;
    }, 'deleteNotificationLocal');
  } catch (err) {
    console.error(
      '\x1b[33m', 'delete notification local error', err, '\x1b[0m',
    );
  }
};

export default deleteNotificationLocal;
