import INotificationsState from '../Interface';

const attach = (set, get) => (payload: any) => {
  const data: INotificationsState = get();

  const { notificationFlag, id } = payload || {};
  const newNotificationData: any = { ...data };
  if (notificationFlag === 'IMPORTANT') {
    newNotificationData.tabImportant.data = [
      id,
      ...newNotificationData.tabImportant.data,
    ];
  } else if (notificationFlag === 'MENTION') {
    newNotificationData.tabMention.data = [
      id,
      ...newNotificationData.tabMention.data,
    ];
  }
  newNotificationData.tabAll.data = [
    id,
    ...newNotificationData.tabAll.data,
  ];
  newNotificationData.tabUnread.data = [
    id,
    ...newNotificationData.tabUnread.data,
  ];

  const newNotifications: any = { ...data.notificationList };
  newNotifications[id] = { ...payload };

  set((state: INotificationsState) => {
    state.notificationList = { ...newNotifications };
    state.unseenNumber += 1;
    state.tabAll.data = newNotificationData.tabAll.data;
    state.tabImportant.data = newNotificationData.tabImportant.data;
    state.tabMention.data = newNotificationData.tabMention.data;
    state.tabUnread.data = newNotificationData.tabUnread.data;
  }, 'attachNotification');
};

export default attach;
