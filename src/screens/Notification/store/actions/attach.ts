import INotificationsState from '../Interface';

const attach = (set, get) => (payload: any) => {
  const data: INotificationsState = get();

  const { notificationFlag, id } = payload || {};
  const newNotificationData: any = { ...data };
  let tabMentionData = newNotificationData.tabMention.data;
  let tabImportantData = newNotificationData.tabImportant.data;
  if (notificationFlag === 'IMPORTANT') {
    tabImportantData = [id, ...newNotificationData.tabImportant.data];
  } else if (notificationFlag === 'MENTION') {
    tabMentionData = [id, ...newNotificationData.tabMention.data];
  }

  const newNotifications: any = { ...data.notificationList };
  newNotifications[id] = { ...payload };
  const tabAllData = [id, ...newNotificationData.tabAll.data];
  const tabUnreadData = [id, ...newNotificationData.tabUnread.data];

  set((state: INotificationsState) => {
    state.notificationList = { ...newNotifications };
    state.unseenNumber += 1;
    state.tabAll.data = tabAllData;
    state.tabImportant.data = tabImportantData;
    state.tabMention.data = tabMentionData;
    state.tabUnread.data = tabUnreadData;
  }, 'attachNotification');
};

export default attach;
