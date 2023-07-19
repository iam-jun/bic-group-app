import INotificationsState from '../Interface';

const deleteAllWaitingNotification = (set, get) => async () => {
  try {
    const { waitingForDelete, actions }: INotificationsState = get();
    if (!waitingForDelete?.length) return;
    waitingForDelete.forEach(async (notificationId) => {
      await actions.deleteNotification(notificationId);
    });

    set((state: INotificationsState) => {
      state.waitingForDelete = [];
    }, 'deleteAllWaitingNotification');
  } catch (err) {
    console.error(
      '\x1b[33m', 'delete notification error', err, '\x1b[0m',
    );
  }
};

export default deleteAllWaitingNotification;
