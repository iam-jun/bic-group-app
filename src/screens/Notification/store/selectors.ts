import INotificationsState from './Interface';

const notiSelector = {
  getNotificationById: (id: string) => (state: INotificationsState) => state?.notificationList?.[id],
  getTabData: (key: string) => (state: INotificationsState) => state[key],
};

export default notiSelector;
