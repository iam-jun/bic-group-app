import notificationApi from '~/api/NotificationApi';

const getChangelogNotification = (_set, _get) => async (notificationId: string) => {
  try {
    if (!notificationId) return;

    const notification = await notificationApi.getChangelogNotification(notificationId);
    console.log('getChangelogNotification', notification);

    // set((state: INotificationsState) => {
    //   state.notificationList = { ...state.notificationList, ...notifications };
    // }, 'markAsReadNotification');
  } catch (err) {
    console.error(
      '\x1b[33m', 'notification get Changelog error', err, '\x1b[0m',
    );
  }
};

export default getChangelogNotification;
